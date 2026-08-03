// ==UserScript==
// @name         TagPro PropHunt
// @author       Thanos Ball
// @namespace    https://tagpro.gg/
// @version      1.0
// @description  PropHunt in TagPro
// @include         https://*.koalabeast.com/profile/*
// @include         https://*.koalabeast.com/game
// @include         https://*.koalabeast.com/game?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var MORPH_COOLDOWN = 1; // 3 second cooldown to avoid chat spam
    var lastMorphTime = 0;

    // --- ENCRYPTION & DECRYPTION HELPERS (Base64 + Salt) ---

    function getRandomSalt(length) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var salt = '';
        for (var i = 0; i < length; i++) {
            salt += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return salt;
    }

    function encryptPayload(tileX, tileY) {
        var salt = getRandomSalt(4); // 4-character random salt
        var rawData = salt + ':' + tileX + ',' + tileY;
        return btoa(rawData); // Base64 encode
    }

    function decryptPayload(base64Str) {
        try {
            var decoded = atob(base64Str); // Base64 decode
            var parts = decoded.split(':');
            if (parts.length < 2) return null;

            var coords = parts[1].split(',');
            var tileX = parseInt(coords[0], 10);
            var tileY = parseInt(coords[1], 10);

            if (!isNaN(tileX) && !isNaN(tileY)) {
                return { tileX: tileX, tileY: tileY };
            }
        } catch (e) {
            return null;
        }
        return null;
    }

    // --- TEXTURE & ANIMATION HELPERS ---

    function getValidTexture(ball) {
        if (ball && ball.texture) return ball.texture;
        if (ball && ball.textures && ball.textures[0]) {
            var t0 = ball.textures[0];
            return t0.texture || t0;
        }
        return PIXI.Texture.EMPTY;
    }

    function formatTextures(input) {
        if (!input) return [{ texture: PIXI.Texture.EMPTY }];
        var arr = Array.isArray(input) ? input : [input];
        var formatted = [];

        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if (!item) continue;
            if (item.texture) {
                formatted.push(item);
            } else {
                formatted.push({ texture: item });
            }
        }

        return formatted.length > 0 ? formatted : [{ texture: PIXI.Texture.EMPTY }];
    }

    function getOrCreateAnimatedBall(player) {
        if (!player || !player.sprites || !player.sprites.ball) return null;

        var ball = player.sprites.ball;
        var SpriteClass = window.PIXI.SpriteClip || window.PIXI.AnimatedSprite;

        if (ball instanceof SpriteClass) {
            return ball;
        }

        var parent = ball.parent;
        var idx = parent.getChildIndex(ball);

        var initialTex = getValidTexture(ball);
        var formatted = formatTextures(initialTex);
        var newBall = new SpriteClass(formatted);

        newBall.position.copyFrom(ball.position);
        newBall.scale.copyFrom(ball.scale);
        if (ball.anchor) newBall.anchor.copyFrom(ball.anchor);
        if (ball.pivot) newBall.pivot.copyFrom(ball.pivot);
        newBall.rotation = ball.rotation;

        parent.removeChild(ball);
        parent.addChildAt(newBall, idx);
        player.sprites.ball = newBall;

        return newBall;
    }

    function getCroppedBackgroundTexture(tileX, tileY) {
        var r = tagpro.renderer;
        if (!r || !r.backgroundChunks || r.backgroundChunks.length === 0) return null;

        var worldX = tileX * 40;
        var worldY = tileY * 40;

        for (var i = 0; i < r.backgroundChunks.length; i++) {
            var chunk = r.backgroundChunks[i];
            if (!chunk || !chunk.texture) continue;

            var chunkX = chunk.x || 0;
            var chunkY = chunk.y || 0;
            var chunkW = chunk.width || (chunk.texture.frame && chunk.texture.frame.width) || 1024;
            var chunkH = chunk.height || (chunk.texture.frame && chunk.texture.frame.height) || 1024;

            if (worldX >= chunkX && worldX < chunkX + chunkW &&
                worldY >= chunkY && worldY < chunkY + chunkH) {

                var localX = worldX - chunkX;
                var localY = worldY - chunkY;
                var cropRect = new PIXI.Rectangle(localX, localY, 40, 40);
                return new PIXI.Texture(chunk.texture.baseTexture, cropRect);
            }
        }
        return null;
    }

    // --- CORE MORPH LOGIC ---

    function applyMorphToPlayer(playerId, tileX, tileY) {
        var player = tagpro.players[playerId];
        if (!player) return;

        if (!tagpro.map || !tagpro.map[tileX] || tagpro.map[tileX][tileY] === undefined) return;

        var ball = getOrCreateAnimatedBall(player);
        if (!ball) return;

        var tileId = tagpro.map[tileX][tileY];
        var tileMeta = tagpro.tiles[tileId];

        // 1. Dynamic / Animated Tile (Boosts, Bombs, Portals)
        var dynamicObj = tagpro.renderer.dynamicSprites &&
                         tagpro.renderer.dynamicSprites[tileX] &&
                         tagpro.renderer.dynamicSprites[tileX][tileY];

        var dynamicTextures = dynamicObj && (dynamicObj.textures || (dynamicObj.sprite && dynamicObj.sprite.textures));

        if (dynamicTextures && dynamicTextures.length > 0) {
            ball.textures = formatTextures(dynamicTextures);
            ball.fps = dynamicObj.fps || 6;
            if (ball.play) ball.play();
        } else {
            var rawTexture = null;

            // 2. Wall Tile Check
            var isWall = tileMeta && (tileMeta.wall || tileId === 1 || String(tileId).startsWith('1.'));
            if (isWall) {
                rawTexture = getCroppedBackgroundTexture(tileX, tileY);
            }

            // 3. Static Tile Check
            if (!rawTexture) {
                if (dynamicObj && dynamicObj.texture) {
                    rawTexture = dynamicObj.texture;
                } else {
                    rawTexture = tagpro.tiles.getTexture(tileId, tileMeta);
                }
            }

            // 4. Fallback Background Crop
            if (!rawTexture) {
                rawTexture = getCroppedBackgroundTexture(tileX, tileY);
            }

            if (rawTexture) {
                ball.textures = formatTextures(rawTexture);
                if (ball.gotoAndStop) {
                    ball.gotoAndStop(0);
                } else if (ball.stop) {
                    ball.stop();
                }
            }
        }

        ball.width = 40;
        ball.height = 40;
    }

    // --- NETWORKING / CHAT LISTENERS ---

    function broadcastMorphPacket(tileX, tileY) {
        if (!tagpro.socket) return;
        var encodedPayload = encryptPayload(tileX, tileY);
        tagpro.socket.emit('chat', {
            message: '!prh:' + encodedPayload,
            toAll: true
        });
    }

    function setupChatListener() {
        if (!tagpro.socket) return;

        tagpro.socket.on('chat', function(data) {
            if (!data || !data.message) return;

            var msg = data.message;
            var senderId = data.from;

            // Check for !prh: prefix
            if (msg.startsWith('!prh:')) {
                var encodedPayload = msg.replace('!prh:', '');
                var payload = decryptPayload(encodedPayload);

                if (payload) {
                    applyMorphToPlayer(senderId, payload.tileX, payload.tileY);
                }
            }
        });
    }

    // --- INITIALIZATION & CLICK EVENT ---

    tagpro.ready(function waitForGame() {
        if (!tagpro.renderer || !tagpro.renderer.canvas || !tagpro.socket) {
            return setTimeout(waitForGame, 100);
        }

        setupChatListener();

        var canvas = tagpro.renderer.canvas;

        canvas.addEventListener('click', function(e) {
            var me = tagpro.players[tagpro.playerId];
            if (!me) return;

            var now = Date.now();
            if (now - lastMorphTime < MORPH_COOLDOWN) {
                var remainingSec = Math.ceil((MORPH_COOLDOWN - (now - lastMorphTime)) / 1000);

                // Emits warning via socket exclusively to team chat
                tagpro.socket.emit('chat', {
                    message: 'Prop morph on cooldown! Wait ' + remainingSec + 's.',
                    toAll: false
                });
                return;
            }

            var rect = canvas.getBoundingClientRect();
            var clickX = e.clientX - rect.left;
            var clickY = e.clientY - rect.top;

            var container = tagpro.renderer.gameContainer || tagpro.renderer.stage;
            var worldX = (clickX - container.position.x) / container.scale.x;
            var worldY = (clickY - container.position.y) / container.scale.y;

            var tileX = Math.floor(worldX / 40);
            var tileY = Math.floor(worldY / 40);

            if (!tagpro.map || !tagpro.map[tileX] || tagpro.map[tileX][tileY] === undefined) return;

            lastMorphTime = now;

            // Apply locally first
            applyMorphToPlayer(tagpro.playerId, tileX, tileY);

            // Broadcast !prh packet to all other players running the script
            broadcastMorphPacket(tileX, tileY);
        });
    });
})();