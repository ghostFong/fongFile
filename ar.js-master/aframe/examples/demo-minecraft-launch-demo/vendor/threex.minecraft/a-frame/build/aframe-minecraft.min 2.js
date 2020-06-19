var THREEx=THREEx||{};THREEx.createAnimation=function(opts){return new THREEx.Animation(opts)};THREEx.Animation=function(){this._updateFcts=[];this.update=function(delta,now){this._updateFcts.forEach(function(updateFct){updateFct(delta,now)})}.bind(this);this._keyframes=new Array;this._totalTime=null;this._onUpdate=null;this._onCapture=function(position){};this._initialPos={};this._propertyTweens={}};THREEx.Animation.prototype.destroy=function(){this.stop()};THREEx.Animation.prototype.pushKeyframe=function(duration,position){this._keyframes.push({duration:duration,position:position});return this};THREEx.Animation.prototype.onUpdate=function(fn){this._onUpdate=fn;return this};THREEx.Animation.prototype.onCapture=function(fn){this._onCapture=fn;return this};THREEx.Animation.prototype.propertyTweens=function(propertyTweens){this._propertyTweens=propertyTweens;return this};THREEx.Animation.prototype.duration=function(){if(this._keyframes.length===0)return 0;var lastKeyframe=this._keyframes[this._keyframes.length-1];return lastKeyframe._endTime};THREEx.Animation.prototype._buildPosition=function(age){var delta=age%this.duration();for(var frameIdx=0;frameIdx<this._keyframes.length;frameIdx++){var baseFrame=this._keyframes[frameIdx];if(delta<baseFrame._startTime)continue;if(delta>=baseFrame._endTime)continue;break}console.assert(frameIdx!==this._keyframes.length);var timeOffset=delta-baseFrame._startTime;var timePercent=timeOffset/baseFrame.duration;var nextFrame=this._keyframes[(frameIdx+1)%this._keyframes.length];var basePosition=baseFrame.position;var nextPosition=nextFrame.position;if(age>baseFrame.duration&&this._initialPos)this._initialPos=null;if(frameIdx===0&&this._initialPos)basePosition=this._initialPos;var result={};for(var property in baseFrame.position){console.assert(nextPosition[property]!==undefined);console.assert(basePosition[property]!==undefined);var baseValue=basePosition[property];var nextValue=nextPosition[property];var propertyTween=this._propertyTweens[property]||function(baseValue,nextValue,timePercent){return(1-timePercent)*baseValue+timePercent*nextValue};result[property]=propertyTween(baseValue,nextValue,timePercent)}return result};THREEx.Animation.prototype.start=function(){this._totalTime=0;this._keyframes.forEach(function(keyframe){keyframe._startTime=this._totalTime;this._totalTime+=keyframe.duration;keyframe._endTime=this._totalTime}.bind(this));this._initialPos=Object.create(this._keyframes[0].position);this._onCapture(this._initialPos);var startDate=Date.now()/1e3;var duration=this.duration();this._$loopCb=function(){var age=Date.now()/1e3-startDate;var position=this._buildPosition(age);this._onUpdate(position)}.bind(this);this._updateFcts.push(this._$loopCb)};THREEx.Animation.prototype.isRunning=function(){return this._$loopCb?true:false};THREEx.Animation.prototype.stop=function(){this._$loopCb&&this._updateFcts.splice(this._updateFcts.indexOf(this._$loopCb),1);this._$loopCb=null};var THREEx=THREEx||{};THREEx.createAnimations=function(){return new THREEx.Animations};THREEx.Animations=function(){this._animations={};this._currentAnim=null;this._animationName=null};THREEx.Animations.prototype.destroy=function(){this._currentAnim&&this._currentAnim.destroy()};THREEx.Animations.prototype.add=function(name,animation){console.assert(animation instanceof THREEx.Animation);this._animations[name]=animation;return this};THREEx.Animations.prototype.list=function(){return this._animations};THREEx.Animations.prototype.names=function(){return Object.keys(this._animations)};THREEx.Animations.prototype.start=function(animationName){if(this._animationName===animationName)return this;if(this.isRunning())this.stop();console.assert(this._animations[animationName]!==undefined,"unknown animation name: "+animationName);this._animationName=animationName;this._currentAnim=this._animations[animationName];this._currentAnim.start();return this};THREEx.Animations.prototype.isRunning=function(){return this._currentAnim?true:false};THREEx.Animations.prototype.update=function(delta,now){if(this.isRunning()===false)return;this._currentAnim.update(delta,now)};THREEx.Animations.prototype.animationName=function(){return this._animationName};THREEx.Animations.prototype.stop=function(){this._currentAnim&&this._currentAnim.destroy();this._currentAnim=null;this._animationName=null;return this};var THREEx=THREEx||{};THREEx.MinecraftChar=function(skinUrl){skinUrl=skinUrl||THREEx.MinecraftChar.baseUrl+"images/jetienne.png";var texture=new THREE.Texture;texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;this.texture=texture;this.loadSkin(skinUrl);var defaultMaterial=THREEx.MinecraftChar.defaultMaterial||THREE.MeshBasicMaterial;var material=new defaultMaterial({map:texture});var materialTran=new defaultMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide});var sizes={};sizes.charH=1;sizes.pixRatio=1/32;sizes.headH=8*sizes.pixRatio;sizes.headW=8*sizes.pixRatio;sizes.headD=8*sizes.pixRatio;sizes.helmetH=9*sizes.pixRatio;sizes.helmetW=9*sizes.pixRatio;sizes.helmetD=9*sizes.pixRatio;sizes.bodyH=12*sizes.pixRatio;sizes.bodyW=8*sizes.pixRatio;sizes.bodyD=4*sizes.pixRatio;sizes.legH=12*sizes.pixRatio;sizes.legW=4*sizes.pixRatio;sizes.legD=4*sizes.pixRatio;sizes.armH=12*sizes.pixRatio;sizes.armW=4*sizes.pixRatio;sizes.armD=4*sizes.pixRatio;var model=this;model.root=new THREE.Object3D;var group=new THREE.Object3D;group.position.y=sizes.charH-sizes.headH;model.headGroup=group;model.root.add(model.headGroup);var geometry=new THREE.CubeGeometry(sizes.headW,sizes.headH,sizes.headD);mapUv(geometry,0,16,24,24,16);mapUv(geometry,1,0,24,8,16);mapUv(geometry,2,8,32,16,24);mapUv(geometry,3,16,32,24,24);mapUv(geometry,4,8,24,16,16);mapUv(geometry,5,24,24,32,16);var mesh=new THREE.Mesh(geometry,material);mesh.position.y=sizes.headH/2;model.head=mesh;model.headGroup.add(model.head);var geometry=new THREE.CubeGeometry(sizes.helmetH,sizes.helmetH,sizes.helmetH);model.helmet=new THREE.Mesh(geometry,materialTran);model.headGroup.add(model.helmet);model.helmet.position.y=sizes.headH/2;mapUv(geometry,0,48,24,56,16);mapUv(geometry,1,32,24,40,16);mapUv(geometry,2,40,32,48,24);mapUv(geometry,3,48,32,56,24);mapUv(geometry,4,40,24,48,16);mapUv(geometry,5,56,24,64,16);var geometry=new THREE.CubeGeometry(sizes.bodyW,sizes.bodyH,sizes.bodyD);model.body=new THREE.Mesh(geometry,material);model.root.add(model.body);model.body.position.y=sizes.legH+sizes.bodyH/2;mapUv(geometry,0,28,12,32,0);mapUv(geometry,1,16,12,20,0);mapUv(geometry,2,20,16,28,12);mapUv(geometry,3,28,16,32,12);mapUv(geometry,4,20,12,28,0);mapUv(geometry,5,32,12,40,0);var geometry=new THREE.CubeGeometry(sizes.armW,sizes.armH,sizes.armD);model.armR=new THREE.Mesh(geometry,material);model.root.add(model.armR);geometry.applyMatrix((new THREE.Matrix4).makeTranslation(0,-sizes.armH/2+sizes.armW/2,0));model.armR.position.x=-sizes.bodyW/2-sizes.armW/2;model.armR.position.y=sizes.legH+sizes.bodyH-sizes.armW/2;mapUv(geometry,0,48,12,52,0);mapUv(geometry,1,40,12,44,0);mapUv(geometry,2,44,16,48,12);mapUv(geometry,3,48,16,52,12);mapUv(geometry,4,44,12,48,0);mapUv(geometry,5,52,12,56,0);var geometry=new THREE.CubeGeometry(sizes.armW,sizes.armH,sizes.armD);model.armL=new THREE.Mesh(geometry,material);model.root.add(model.armL);geometry.applyMatrix((new THREE.Matrix4).makeTranslation(0,-sizes.armH/2+sizes.armW/2,0));model.armL.position.x=sizes.bodyW/2+sizes.armW/2;model.armL.position.y=sizes.legH+sizes.bodyH-sizes.armW/2;mapUv(geometry,0,44,12,40,0);mapUv(geometry,1,52,12,48,0);mapUv(geometry,2,44,16,48,12);mapUv(geometry,3,48,16,52,12);mapUv(geometry,4,48,12,44,0);mapUv(geometry,5,56,12,52,0);var geometry=new THREE.CubeGeometry(sizes.legW,sizes.legH,sizes.legD);model.legR=new THREE.Mesh(geometry,material);model.root.add(model.legR);geometry.applyMatrix((new THREE.Matrix4).makeTranslation(0,-sizes.legH/2,0));model.legR.position.x=-sizes.legW/2;model.legR.position.y=sizes.legH;mapUv(geometry,0,8,12,12,0);mapUv(geometry,1,0,12,4,0);mapUv(geometry,2,4,16,8,12);mapUv(geometry,3,8,16,12,12);mapUv(geometry,4,4,12,8,0);mapUv(geometry,5,12,12,16,0);var geometry=new THREE.CubeGeometry(sizes.legW,sizes.legH,sizes.legD);model.legL=new THREE.Mesh(geometry,material);model.root.add(model.legL);geometry.applyMatrix((new THREE.Matrix4).makeTranslation(0,-sizes.legH/2,0));model.legL.position.x=sizes.legW/2;model.legL.position.y=sizes.legH;mapUv(geometry,0,4,12,0,0);mapUv(geometry,1,12,12,8,0);mapUv(geometry,2,8,16,4,12);mapUv(geometry,3,12,16,8,12);mapUv(geometry,4,8,12,4,0);mapUv(geometry,5,16,12,12,0);return;function mapUv(geometry,faceIdx,x1,y1,x2,y2){var tileUvW=1/64;var tileUvH=1/32;if(geometry.faces[faceIdx]instanceof THREE.Face3){var UVs=geometry.faceVertexUvs[0][faceIdx*2];UVs[0].x=x1*tileUvW;UVs[0].y=y1*tileUvH;UVs[1].x=x1*tileUvW;UVs[1].y=y2*tileUvH;UVs[2].x=x2*tileUvW;UVs[2].y=y1*tileUvH;var UVs=geometry.faceVertexUvs[0][faceIdx*2+1];UVs[0].x=x1*tileUvW;UVs[0].y=y2*tileUvH;UVs[1].x=x2*tileUvW;UVs[1].y=y2*tileUvH;UVs[2].x=x2*tileUvW;UVs[2].y=y1*tileUvH}else if(geometry.faces[faceIdx]instanceof THREE.Face4){var UVs=geometry.faceVertexUvs[0][faceIdx];UVs[0].x=x1*tileUvW;UVs[0].y=y1*tileUvH;UVs[1].x=x1*tileUvW;UVs[1].y=y2*tileUvH;UVs[2].x=x2*tileUvW;UVs[2].y=y2*tileUvH;UVs[3].x=x2*tileUvW;UVs[3].y=y1*tileUvH}else console.assert(false)}};THREEx.MinecraftChar.baseUrl="../";THREEx.MinecraftChar.defaultMaterial=null;THREEx.MinecraftChar.prototype.loadSkin=function(url,onLoad){var image=new Image;image.onload=function(){this.texture.image=image;this.texture.needsUpdate=true;onLoad&&onLoad(this)}.bind(this);image.src=url;return this};THREEx.MinecraftChar.prototype.loadWellKnownSkin=function(name,onLoad){console.assert(THREEx.MinecraftChar.skinWellKnownUrls[name]);var url=THREEx.MinecraftChar.baseUrl+THREEx.MinecraftChar.skinWellKnownUrls[name];return this.loadSkin(url,onLoad)};THREEx.MinecraftChar.skinWellKnownUrls={"3djesus":"images/3djesus.png","iron-man":"images/Iron-Man-Minecraft-Skin.png",joker:"images/Joker.png",mario:"images/Mario.png",sonicthehedgehog:"images/Sonicthehedgehog.png",spiderman:"images/Spiderman.png",superman:"images/Superman.png",agentsmith:"images/agentsmith.png",batman:"images/batman.png","char":"images/char.png",god:"images/god.png",jetienne:"images/jetienne.png",martialartist:"images/martialartist.png",robocop:"images/robocop.png",theflash:"images/theflash.png",woody:"images/woody.png"};var THREEx=THREEx||{};THREEx.MinecraftBubble=function(character){var _this=this;var onRenderFcts=[];this.update=function(delta,now){onRenderFcts.forEach(function(updateFct){updateFct(delta,now)})}.bind(this);this._object3D=null;this._createdAt=null;this.expireAfter=10;this.update=function(delta,now){if(_this._createdAt===null)return;var sayAge=(Date.now()-_this._createdAt)/1e3;if(sayAge<_this.expireAfter)return;_this.clear()};this.clear=function(){if(this._object3D===null)return;character.root.remove(this._object3D);this._object3D=null;this._createdAt=null};this.set=function(text){if(this._object3D)this.clear();this._createdAt=Date.now();var canvas=buildChatBubble(text);var texture=new THREE.Texture(canvas);texture.needsUpdate=true;var material=new THREE.SpriteMaterial({map:texture,useScreenCoordinates:false});var sprite=new THREE.Sprite(material);this._object3D=sprite;sprite.scale.multiplyScalar(4);sprite.position.y=1.5;character.root.add(this._object3D)};return;function buildChatBubble(text){var canvas=document.createElement("canvas");var context=canvas.getContext("2d");canvas.width=1024;canvas.height=512;context.translate(canvas.width/2,canvas.height/2);var fontSize=24;context.font="bolder "+fontSize+"px Verdana";var fontH=fontSize;var fontW=context.measureText(text).width;context.fillStyle="rgba(255,255,255,0.3)";var scale=1.2;context.fillRect(-fontW*scale/2,-fontH*scale/1.3,fontW*scale,fontH*scale);context.fillStyle="rgba(0,0,0,0.7)";context.fillText(text,-fontW/2,0);return canvas}};var THREEx=THREEx||{};THREEx.createMinecraftCharBodyAnimations=function(character){return new THREEx.MinecraftCharBodyAnimations(character)};THREEx.MinecraftCharBodyAnimations=function(character){var animations=this;THREEx.Animations.call(this);var tweenAngle=function(baseValue,nextValue,timePercent){if(nextValue-baseValue>+Math.PI)nextValue-=Math.PI*2;if(nextValue-baseValue<-Math.PI)nextValue+=Math.PI*2;return(1-timePercent)*baseValue+timePercent*nextValue};var onUpdate=function(position){character.armR.rotation.z=position.armRRotationZ?position.armRRotationZ:0;character.armL.rotation.z=position.armLRotationZ?position.armLRotationZ:0;character.armR.rotation.x=position.armRotationX?position.armRotationX:0;character.armL.rotation.x=position.armRotationX?-position.armRotationX:0;character.legR.rotation.z=position.legRRotationZ?position.legRRotationZ:0;character.legL.rotation.z=position.legLRotationZ?position.legLRotationZ:0;character.legR.rotation.x=position.legRotationX?position.legRotationX:0;character.legL.rotation.x=position.legRotationX?-position.legRotationX:0};var onCapture=function(position){position.armLRotationZ=character.armL.rotation.z;position.armRRotationZ=character.armR.rotation.z;position.armRotationX=character.armR.rotation.x;position.legLRotationZ=character.legL.rotation.z;position.legRRotationZ=character.legR.rotation.z;position.legRotationX=character.legR.rotation.x};var propTweens={armLRotationZ:tweenAngle,armRRotationZ:tweenAngle,armRotationX:tweenAngle,legLRotationZ:tweenAngle,legRRotationZ:tweenAngle,legRotationX:tweenAngle};var angleRange=Math.PI/2-Math.PI/10;animations.add("run",THREEx.createAnimation().pushKeyframe(.5,{armLRotationZ:+Math.PI/10,armRRotationZ:-Math.PI/10,armRotationX:+angleRange,legRotationX:-angleRange}).pushKeyframe(.5,{armLRotationZ:+Math.PI/10,armRRotationZ:-Math.PI/10,armRotationX:-angleRange,legRotationX:+angleRange}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));animations.add("strafe",THREEx.createAnimation().pushKeyframe(.5,{armLRotationZ:+angleRange/2,armRRotationZ:-angleRange/2,armRotationX:+Math.PI/10,legLRotationZ:-angleRange,legRRotationZ:+angleRange,legRotationX:-Math.PI/5}).pushKeyframe(.5,{armLRotationZ:-angleRange/2,armRRotationZ:+angleRange/2,armRotationX:+Math.PI/10,legLRotationZ:+angleRange,legRRotationZ:-angleRange,legRotationX:-Math.PI/5}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));var angleRange=Math.PI/3-Math.PI/10;animations.add("walk",THREEx.createAnimation().pushKeyframe(.5,{armLRotationZ:+Math.PI/30,armRRotationZ:-Math.PI/30,armRotationX:+angleRange,legRotationX:-angleRange}).pushKeyframe(.5,{armLRotationZ:+Math.PI/30,armRRotationZ:-Math.PI/30,armRotationX:-angleRange,legRotationX:+angleRange}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));animations.add("stand",THREEx.createAnimation().pushKeyframe(.3,{armLRotationZ:0,armRRotationZ:0,armRotationX:0,legLRotationZ:0,legRRotationZ:0,legRotationX:0}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));animations.add("jump",THREEx.createAnimation().pushKeyframe(.15,{armLRotationZ:+3*Math.PI/4,armRRotationZ:-3*Math.PI/4,armRotationX:+angleRange,legRotationX:+angleRange}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));animations.add("fall",THREEx.createAnimation().pushKeyframe(.5,{armLRotationZ:Math.PI-3*Math.PI/5,armRRotationZ:Math.PI+3*Math.PI/5,armRotationX:+angleRange,legLRotationZ:+Math.PI/5,legRRotationZ:-Math.PI/5,legRotationX:+angleRange}).pushKeyframe(.5,{armLRotationZ:Math.PI-Math.PI/10,armRRotationZ:Math.PI+Math.PI/10,armRotationX:-angleRange,legLRotationZ:0,legRRotationZ:0,legRotationX:-angleRange}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));var angleRange=Math.PI/2-Math.PI/10;animations.add("wave",THREEx.createAnimation().pushKeyframe(.5,{armLRotationZ:0,armRRotationZ:Math.PI+2*Math.PI/5,armRotationX:0,legRotationX:0}).pushKeyframe(.5,{armLRotationZ:0,armRRotationZ:Math.PI+Math.PI/10,armRotationX:0,legRotationX:0}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));var angleRange=Math.PI/2-Math.PI/10;animations.add("hiwave",THREEx.createAnimation().pushKeyframe(.5,{armLRotationZ:Math.PI-3*Math.PI/5,armRRotationZ:Math.PI+3*Math.PI/5,armRotationX:0,legRotationX:0}).pushKeyframe(.5,{armLRotationZ:Math.PI-Math.PI/10,armRRotationZ:Math.PI+Math.PI/10,armRotationX:0,legRotationX:0}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));var delay=1/5;animations.add("circularPunch",THREEx.createAnimation().pushKeyframe(delay,{armLRotationZ:0,armRRotationZ:0,armRotationX:0,legRotationX:0}).pushKeyframe(delay,{armLRotationZ:0,armRRotationZ:0,armRotationX:-Math.PI/2,legRotationX:0}).pushKeyframe(delay,{armLRotationZ:0,armRRotationZ:0,armRotationX:-Math.PI,legRotationX:0}).pushKeyframe(delay,{armLRotationZ:0,armRRotationZ:0,armRotationX:+Math.PI/2,legRotationX:0}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));var angleRange=Math.PI/2-Math.PI/10;animations.add("rightPunch",THREEx.createAnimation().pushKeyframe(.1,{armLRotationZ:+Math.PI/10,armRRotationZ:-Math.PI/10,armRotationX:0,legRotationX:0}).pushKeyframe(.3,{armLRotationZ:-Math.PI/10,armRRotationZ:-Math.PI/10,armRotationX:+Math.PI/2+Math.PI/5,legRotationX:0}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate))};THREEx.MinecraftCharBodyAnimations.prototype=Object.create(THREEx.Animations.prototype);var THREEx=THREEx||{};THREEx.createMinecraftCharHeadAnimations=function(character){return new THREEx.MinecraftCharHeadAnimations(character)};THREEx.MinecraftCharHeadAnimations=function(character){var animations=this;THREEx.Animations.call(this);var tweenAngle=function(baseValue,nextValue,timePercent){if(nextValue-baseValue>Math.PI)nextValue-=Math.PI*2;if(nextValue-baseValue<-Math.PI)nextValue+=Math.PI*2;return(1-timePercent)*baseValue+timePercent*nextValue};var onUpdate=function(position){character.headGroup.rotation.x=position.headRotationX;character.headGroup.rotation.y=position.headRotationY};var onCapture=function(position){position.headRotationX=character.headGroup.rotation.x;position.headRotationY=character.headGroup.rotation.y};var propTweens={headRotationX:tweenAngle,headRotationY:tweenAngle};animations.add("still",THREEx.createAnimation().pushKeyframe(.5,{headRotationX:0,headRotationY:0}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));animations.add("no",THREEx.createAnimation().pushKeyframe(.5,{headRotationX:0,headRotationY:+Math.PI/6}).pushKeyframe(.5,{headRotationX:0,headRotationY:-Math.PI/6}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate));animations.add("yes",THREEx.createAnimation().pushKeyframe(.4,{headRotationY:0,headRotationX:+Math.PI/8}).pushKeyframe(.4,{headRotationX:-Math.PI/8,headRotationY:0}).propertyTweens(propTweens).onCapture(onCapture).onUpdate(onUpdate))};THREEx.MinecraftCharHeadAnimations.prototype=Object.create(THREEx.Animations.prototype);var THREEx=THREEx||{};THREEx.MinecraftControls=function(character,input){var _this=this;input=input||{};this.speed=2;this.angularSpeed=.2*Math.PI*2;this.input=input;this.object3d=character.root;this.update=function(delta,now){var prevPosition=_this.object3d.position.clone();if(input.left)_this.object3d.rotation.y+=this.angularSpeed*delta;if(input.right)_this.object3d.rotation.y-=this.angularSpeed*delta;var distance=0;if(input.strafeLeft)distance=+this.speed*delta;if(input.strafeRight)distance=-this.speed*delta;if(distance){var velocity=new THREE.Vector3(distance,0,0);var matrix=(new THREE.Matrix4).makeRotationY(object3d.rotation.y);velocity.applyMatrix4(matrix);_this.object3d.position.add(velocity)}var distance=0;if(input.up)distance=+this.speed*delta;if(input.down)distance=-this.speed*delta;if(distance){var velocity=new THREE.Vector3(0,0,distance);var matrix=(new THREE.Matrix4).makeRotationY(_this.object3d.rotation.y);velocity.applyMatrix4(matrix);_this.object3d.position.add(velocity)}}};THREEx.MinecraftControls.setKeyboardInput=function(controls,mappings){mappings=mappings||["wasd","ijkl","arrows"];document.body.addEventListener("keydown",function(event){var input=controls.input;if(mappings.indexOf("wasd")!==-1){if(event.keyCode==="W".charCodeAt(0))input.up=true;if(event.keyCode==="S".charCodeAt(0))input.down=true;if(event.keyCode==="A".charCodeAt(0))input.left=true;if(event.keyCode==="D".charCodeAt(0))input.right=true;if(event.keyCode==="Q".charCodeAt(0))input.strafeLeft=true;if(event.keyCode==="E".charCodeAt(0))input.strafeRight=true}if(mappings.indexOf("ijkl")!==-1){if(event.keyCode==="I".charCodeAt(0))input.up=true;if(event.keyCode==="K".charCodeAt(0))input.down=true;if(event.keyCode==="J".charCodeAt(0))input.left=true;if(event.keyCode==="L".charCodeAt(0))input.right=true;if(event.keyCode==="U".charCodeAt(0))input.strafeLeft=true;if(event.keyCode==="O".charCodeAt(0))input.strafeRight=true}if(mappings.indexOf("arrows")!==-1){if(event.keyCode===38)input.up=true;if(event.keyCode===40)input.down=true;if(event.keyCode===37&&!event.shiftKey)input.left=true;if(event.keyCode===39&&!event.shiftKey)input.right=true;if(event.keyCode===37&&event.shiftKey)input.strafeLeft=true;if(event.keyCode===39&&event.shiftKey)input.strafeRight=true}});document.body.addEventListener("keyup",function(event){var input=controls.input;if(mappings.indexOf("wasd")!==-1){if(event.keyCode==="W".charCodeAt(0))input.up=false;if(event.keyCode==="S".charCodeAt(0))input.down=false;if(event.keyCode==="A".charCodeAt(0))input.left=false;if(event.keyCode==="D".charCodeAt(0))input.right=false;if(event.keyCode==="Q".charCodeAt(0))input.strafeLeft=false;if(event.keyCode==="E".charCodeAt(0))input.strafeRight=false}if(mappings.indexOf("ijkl")!==-1){if(event.keyCode==="I".charCodeAt(0))input.up=false;if(event.keyCode==="K".charCodeAt(0))input.down=false;if(event.keyCode==="J".charCodeAt(0))input.left=false;if(event.keyCode==="L".charCodeAt(0))input.right=false;if(event.keyCode==="U".charCodeAt(0))input.strafeLeft=false;if(event.keyCode==="O".charCodeAt(0))input.strafeRight=false}if(mappings.indexOf("arrows")!==-1){if(event.keyCode===38)input.up=false;if(event.keyCode===40)input.down=false;if(event.keyCode===37||event.shiftKey)input.left=false;if(event.keyCode===39||event.shiftKey)input.right=false;if(event.keyCode===37||!event.shiftKey)input.strafeLeft=false;if(event.keyCode===39||!event.shiftKey)input.strafeRight=false}});return controls};var THREEx=THREEx||{};THREEx.MinecraftNickname=function(character){this.object3d=null;this.clear=function(){if(this.object3d===null)return;character.root.remove(this.object3d);this.object3d=null};this.set=function(nickName){if(this.object3d)this.clear();var canvas=buildNickCartouche(nickName);var texture=new THREE.Texture(canvas);texture.needsUpdate=true;var material=new THREE.SpriteMaterial({map:texture,useScreenCoordinates:false});var sprite=new THREE.Sprite(material);this.object3d=sprite;sprite.position.y=1.15;character.root.add(this.object3d)};return;function buildNickCartouche(text){var canvas=document.createElement("canvas");var context=canvas.getContext("2d");canvas.width=256;canvas.height=128;context.translate(canvas.width/2,canvas.height/2);var fontSize=36;context.font="bolder "+fontSize+"px Verdana";var fontH=fontSize;var fontW=context.measureText(text).width;context.fillStyle="rgba(0,0,255,0.3)";var scale=1.2;context.fillRect(-fontW*scale/2,-fontH*scale/1.3,fontW*scale,fontH*scale);context.fillStyle="rgba(0,0,0,0.7)";context.fillText(text,-fontW/2,0);return canvas}};AFRAME.registerPrimitive("a-minecraft",AFRAME.utils.extendDeep({},AFRAME.primitives.getMeshMixin(),{defaultComponents:{minecraft:{},"minecraft-head-anim":"still","minecraft-body-anim":"stand","minecraft-nickname":"John","minecraft-bubble":"","minecraft-controls":{}}}));AFRAME.registerComponent("minecraft",{schema:{skinUrl:{type:"string","default":""},wellKnownSkin:{type:"string","default":""},heightMeter:{"default":1.6}},init:function(){var character=new THREEx.MinecraftChar;this.character=character;this.el.object3D.add(character.root)},update:function(){if(Object.keys(this.data).length===0)return;var character=this.character;character.root.scale.set(1,1,1).multiplyScalar(this.data.heightMeter);if(this.data.skinUrl){character.loadSkin(this.data.skinUrl)}else if(this.data.wellKnownSkin){character.loadWellKnownSkin(this.data.wellKnownSkin)}}});AFRAME.registerComponent("minecraft-head-anim",{schema:{type:"string","default":"yes"},init:function(){var character=this.el.components.minecraft.character;this.headAnims=new THREEx.MinecraftCharHeadAnimations(character)},tick:function(now,delta){this.headAnims.update(delta/1e3,now/1e3)},update:function(){if(Object.keys(this.data).length===0)return;console.assert(this.headAnims.names().indexOf(this.data)!==-1);this.headAnims.start(this.data)}});AFRAME.registerComponent("minecraft-body-anim",{schema:{type:"string","default":"wave"},init:function(){var character=this.el.components.minecraft.character;this.bodyAnims=new THREEx.MinecraftCharBodyAnimations(character)},tick:function(now,delta){var minecraftControls=this.el.components["minecraft-controls"];if(minecraftControls){var input=minecraftControls.controls.input;if(input.up||input.down){this.bodyAnims.start("run")}else if(input.strafeLeft||input.strafeRight){this.bodyAnims.start("strafe")}else{this.bodyAnims.start("stand")}}this.bodyAnims.update(delta/1e3,now/1e3)},update:function(){if(Object.keys(this.data).length===0)return;console.assert(this.bodyAnims.names().indexOf(this.data)!==-1);this.bodyAnims.start(this.data)}});AFRAME.registerComponent("minecraft-nickname",{schema:{type:"string","default":"Joe"},init:function(){var character=this.el.components.minecraft.character;this.nickName=new THREEx.MinecraftNickname(character)},update:function(){if(Object.keys(this.data).length===0)return;this.nickName.set(this.data)}});AFRAME.registerComponent("minecraft-bubble",{schema:{type:"string","default":"Hello world."},init:function(){var character=this.el.components.minecraft.character;this.bubble=new THREEx.MinecraftBubble(character)},update:function(){if(Object.keys(this.data).length===0)return;this.bubble.set(this.data)},tick:function(now,delta){this.bubble.update(delta/1e3,now/1e3)}});AFRAME.registerComponent("minecraft-controls",{schema:{},init:function(){var character=this.el.components.minecraft.character;this.controls=new THREEx.MinecraftControls(character);THREEx.MinecraftControls.setKeyboardInput(this.controls,["wasd","arrows","ijkl"])},tick:function(now,delta){this.controls.update(delta/1e3,now/1e3)}});
