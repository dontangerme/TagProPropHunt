// ==UserScript==
// @name         TagPro PropHunt
// @author       Thanos Ball
// @namespace    https://tagpro.gg/
// @version      2.0
// @description  PropHunt in TagPro
// @include         https://*.koalabeast.com/profile/*
// @include         https://*.koalabeast.com/game
// @include         https://*.koalabeast.com/game?*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // --- CONFIGURATION ---
    var MORPH_COOLDOWN = 2000;  // 3 second cooldown between morphs
    var TAUNT_COOLDOWN = 2000;  // 5 second cooldown between taunts

    // Replace these URLs with your preferred taunt audio files!
    var TAUNT_SOUNDS = [
        "data:audio/mp3;base64,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",          // Key 1
        "https://github.com/dontangerme/TagProPropHunt/raw/refs/heads/main/ftg.mp3",     // Key 2
        "https://github.com/dontangerme/TagProPropHunt/raw/refs/heads/main/Meccha%20Chameleon%20Whistle%20Sound%20Effect.mp3",     // Key 3
        "https://github.com/dontangerme/TagProPropHunt/raw/refs/heads/main/RIZZ%20Sound%20Effect%204.mp3",         // Key 4
        "https://github.com/dontangerme/TagProPropHunt/raw/refs/heads/main/hi.mp3",     // Key 5
        "https://github.com/dontangerme/TagProPropHunt/raw/refs/heads/main/bye.mp3"
    ];

    var lastMorphTime = 0;
    var lastTauntTime = 0;

    // --- RENDERER OVERRIDES (Hide Names, Flairs, Degrees) ---

    function disableMetadataRenderer() {
        var r = tagpro.renderer;
        if (!r) return;

        // Override drawName to destroy text sprite cleanly
        r.drawName = function(t) {
            if (t && t.sprites && t.sprites.name) {
                t.sprites.name.destroy();
                t.sprites.name = null;
            }
        };

        // Override drawFlair
        if (r.drawFlair) {
            r.drawFlair = function(t) {
                if (t && t.sprites && t.sprites.flair) {
                    t.sprites.flair.destroy();
                    t.sprites.flair = null;
                }
            };
        }

        // Override drawDegrees / drawDegree
        var degreeFn = r.drawDegree ? 'drawDegree' : (r.drawDegrees ? 'drawDegrees' : null);
        if (degreeFn) {
            r[degreeFn] = function(t) {
                if (t && t.sprites && t.sprites.degrees) {
                    t.sprites.degrees.destroy();
                    t.sprites.degrees = null;
                }
            };
        }
    }

    // --- ENCRYPTION & DECRYPTION HELPERS (Base64 + Salt) ---

    function getRandomSalt(length) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var salt = '';
        for (var i = 0; i < length; i++) {
            salt += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return salt;
    }

    function encryptPayload(type, valA, valB, extra) {
        var salt = getRandomSalt(4); // 4-character random salt
        var rawData = salt + ':' + type + ':' + valA + ',' + valB + (extra !== undefined ? ',' + extra : '');
        return btoa(rawData); // Base64 encode
    }

    function decryptPayload(base64Str) {
        try {
            var decoded = atob(base64Str); // Base64 decode
            var parts = decoded.split(':');
            if (parts.length < 3) return null;

            var type = parts[1];
            var coords = parts[2].split(',');
            var valA = parseFloat(coords[0]);
            var valB = parseFloat(coords[1]);
            var extra = coords.length > 2 ? parseInt(coords[2], 10) : 0;

            if (!isNaN(valA) && !isNaN(valB)) {
                return { type: type, valA: valA, valB: valB, extra: extra };
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

    // --- RESET TO HUNTER ---

function resetPlayerToDefault(playerId) {
    var player = tagpro.players[playerId];
    if (!player) return;

    var r = tagpro.renderer;
    if (!r) return;

    // 1. Destroy old player container, flags, and particle emitters
    if (r.destroyPlayer) {
        r.destroyPlayer(player);
    }

    // 2. Re-initialize sprites container to prevent TypeError (setting 'ball')
    player.sprites = {};

    // 3. Native rebuild of player sprite (Hunter ball, rotation, & powerup anchors)
    if (r.createPlayerSprite) {
        r.createPlayerSprite(player);
    }

    // 4. Re-apply metadata renderer overrides (names, degrees, flairs)
    disableMetadataRenderer();
}
    // --- MORPH LOGIC ---

function applyTileMorphToPlayer(playerId, tileX, tileY) {
        var player = tagpro.players[playerId];
        if (!player) return;

        if (!tagpro.map || !tagpro.map[tileX] || tagpro.map[tileX][tileY] === undefined) return;

        if (player.sprites && player.sprites.actualBall) {
            player.sprites.actualBall.destroy();
            player.sprites.actualBall = null;
        }

        var ball = getOrCreateAnimatedBall(player);
        if (!ball) return;

        var tileId = tagpro.map[tileX][tileY];
        var tileMeta = tagpro.tiles[tileId];

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

            var isWall = tileMeta && (tileMeta.wall || tileId === 1 || String(tileId).startsWith('1.'));
            if (isWall) {
                rawTexture = getCroppedBackgroundTexture(tileX, tileY);
            }

            if (!rawTexture) {
                if (dynamicObj && dynamicObj.texture) {
                    rawTexture = dynamicObj.texture;
                } else {
                    rawTexture = tagpro.tiles.getTexture(tileId, tileMeta);
                }
            }

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
    function applyBallColorMorphToPlayer(playerId, teamColor) {
        var player = tagpro.players[playerId];
        if (!player || !player.sprites) return;
resetPlayerToDefault(playerId);
        if (player.sprites.ball) {
            if (player.sprites.ball.stop) player.sprites.ball.stop();
            player.sprites.ball.textures = formatTextures(PIXI.Texture.EMPTY);
        }

        var tileName = (teamColor === 'red') ? 'redball' : 'blueball';

        if (player.sprites.actualBall) {
            player.sprites.actualBall.destroy();
            player.sprites.actualBall = null;
        }

        player.sprites.actualBall = tagpro.tiles.draw(
            player.sprites.ball,
            tileName,
            { x: 20, y: 20 },
            null, null, null, true
        );

        if (player.sprites.actualBall) {
            player.sprites.actualBall.anchor.x = 0.5;
            player.sprites.actualBall.anchor.y = 0.5;
            player.sprites.actualBall.tileId = tileName;
        }
    }

    function triggerBallColorMorph(color) {
        var me = tagpro.players[tagpro.playerId];
        if (!me) return;

        if (me.team !== 1) {
            tagpro.socket.emit('chat', {
                message: 'Only Props (Red Team) can morph!',
                toAll: false
            });
            return;
        }

        var now = Date.now();
        if (now - lastMorphTime < MORPH_COOLDOWN) {
            var remainingSec = Math.ceil((MORPH_COOLDOWN - (now - lastMorphTime)) / 1000);
            tagpro.socket.emit('chat', {
                message: 'Prop morph on cooldown! Wait ' + remainingSec + 's.',
                toAll: false
            });
            return;
        }

        lastMorphTime = now;
        var colorVal = (color === 'red') ? 1 : 2;

        applyBallColorMorphToPlayer(tagpro.playerId, color);
        broadcastMorphPacket('ball', colorVal, 0);
    }

    // --- PROXIMITY TAUNT SYSTEM ---

    function triggerProximityTaunt(soundIndex) {
        var me = tagpro.players[tagpro.playerId];
        if (!me || me.dead) return;

        if (me.team !== 1) {
            tagpro.socket.emit('chat', {
                message: 'Only Props (Red Team) can taunt!',
                toAll: false
            });
            return;
        }

        var now = Date.now();
        if (now - lastTauntTime < TAUNT_COOLDOWN) {
            var remainingSec = Math.ceil((TAUNT_COOLDOWN - (now - lastTauntTime)) / 1000);
            tagpro.socket.emit('chat', {
                message: 'Taunt on cooldown! Wait ' + remainingSec + 's.',
                toAll: false
            });
            return;
        }

        lastTauntTime = now;
        var soundIdx = (soundIndex !== undefined && soundIndex < TAUNT_SOUNDS.length) ? soundIndex : 0;
        var encryptedCoords = encryptPayload('taunt', Math.round(me.x), Math.round(me.y), soundIdx);

        playTauntAudio(soundIdx, 1.0);

        tagpro.socket.emit('chat', {
            message: '!prh_taunt:' + encryptedCoords,
            toAll: true
        });
    }

function handleIncomingTaunt(senderId, propX, propY, soundIndex) {
    if (senderId === tagpro.playerId) return;

    var me = tagpro.players[tagpro.playerId];
    if (!me) return;

    // Calculate pixel distance between Hunter and Prop
    var dx = me.x - propX;
    var dy = me.y - propY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    // Tile metrics (40px per tile)
    var minRange = 120; // 3 tiles (100% full volume zone)
    var maxRange = 640; // 15 tiles (Viewport boundary)
    var faintFloor = 0.1; // 5% faint volume floor for distant taunts

    var volume;

    if (dist <= minRange) {
        // Full volume if close
        volume = 1.0;
    } else if (dist <= maxRange) {
        // Smooth linear falloff from 1.0 down to 0.05 across the viewport screen
        volume = 1.0 - ((dist - minRange) / (maxRange - minRange)) * (1.0 - faintFloor);
    } else {
        // Anything past 15 tiles stays at the faint audio floor (5%)
        volume = faintFloor;
    }

    playTauntAudio(soundIndex, volume);
}

    function playTauntAudio(soundIndex, volume) {
        var soundUrl = TAUNT_SOUNDS[soundIndex] || TAUNT_SOUNDS[0];
        var audio = new Audio(soundUrl);
        audio.volume = volume;
        audio.play();
    }

    // --- NETWORKING / CHAT LISTENERS ---

    function broadcastMorphPacket(type, valA, valB) {
        if (!tagpro.socket) return;
        var encodedPayload = encryptPayload(type, valA, valB);
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

            // 1. Morph Packets
            if (msg.startsWith('!prh:')) {
                var encodedPayload = msg.replace('!prh:', '');
                var payload = decryptPayload(encodedPayload);

                if (payload) {
                    if (payload.type === 'tile') {
                        applyTileMorphToPlayer(senderId, payload.valA, payload.valB);
                    } else if (payload.type === 'ball') {
                        var colorStr = (payload.valA === 1) ? 'red' : 'blue';
                        applyBallColorMorphToPlayer(senderId, colorStr);
                    }
                }
            }
            // 2. Taunt Packets
            else if (msg.startsWith('!prh_taunt:')) {
                var encodedTaunt = msg.replace('!prh_taunt:', '');
                var tauntPayload = decryptPayload(encodedTaunt);

                if (tauntPayload) {
                    handleIncomingTaunt(senderId, tauntPayload.valA, tauntPayload.valB, tauntPayload.extra);
                }
            }
            // 3. System Chat Team Switch Listener
            else if (senderId === null && msg.indexOf('has switched to the') !== -1) {
                for (var id in tagpro.players) {
                    if (!tagpro.players.hasOwnProperty(id)) continue;

                    var p = tagpro.players[id];
                    if (p && p.name && msg.startsWith(p.name + ' has switched to the')) {

                        // If player switched to Blue team (Hunters), reset them to default hunter ball
                        if (msg.indexOf('switched to the Blue team') !== -1) {
                            resetPlayerToDefault(p.id);
                        }
                        break;
                    }
                }
            }
        });
    }

    // --- INITIALIZATION & KEY/CLICK BINDS ---

    tagpro.ready(function waitForGame() {
        if (!tagpro.renderer || !tagpro.renderer.canvas || !tagpro.socket) {
            return setTimeout(waitForGame, 100);
        }

        disableMetadataRenderer();
        setupChatListener();
console.log(tagpro);
        // Keyboard Listener
        window.addEventListener('keydown', function(e) {
            if (tagpro.disableKeyboard) return; // Chatbox focused

            var key = e.key.toLowerCase();

            // Keys 1-5 -> Specific Taunts
            if (['1', '2', '3', '4', '5','6'].indexOf(key) !== -1) {
                var soundIdx = parseInt(key, 10) - 1;
                triggerProximityTaunt(soundIdx);
            }
            // 'O' key -> Morph into Red Ball
            else if (key === 'o') {
                triggerBallColorMorph('red');
            }
            // 'P' key -> Morph into Blue Ball
            else if (key === 'p') {
                triggerBallColorMorph('blue');
            }

 
        });

        // Mouse click listener for Tile Morphing
        var canvas = tagpro.renderer.canvas;

        canvas.addEventListener('click', function(e) {
            var me = tagpro.players[tagpro.playerId];
            if (!me) return;

            if (me.team !== 1) {
                tagpro.socket.emit('chat', {
                    message: 'Only Props (Red Team) can morph into tiles!',
                    toAll: false
                });
                return;
            }

            var now = Date.now();
            if (now - lastMorphTime < MORPH_COOLDOWN) {
                var remainingSec = Math.ceil((MORPH_COOLDOWN - (now - lastMorphTime)) / 1000);

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

            applyTileMorphToPlayer(tagpro.playerId, tileX, tileY);
            broadcastMorphPacket('tile', tileX, tileY);
        });
    });
})();