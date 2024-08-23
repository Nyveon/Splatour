import * as THREE from 'three';

function clamp(x, a, b) {
    return Math.min(Math.max(x, a), b);
}

class InputController {
    constructor(canvas) {
        this.canvas = canvas;
        this.initialize_();
    }

    initialize_() {
        this.current_ = {
            leftButton: false,
            rightButton: false,
            mouseX: 0,
            mouseY: 0,
            mouseXDelta: 0,
            mouseYDelta: 0
        };

        this.previous_ = null;
        this.keys_ = {};
        this.previousKeys_ = {};

        document.addEventListener('mousedown', (e) => this.onMouseDown_(e), false);
        document.addEventListener('mouseup', (e) => this.onMouseUp_(e), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove_(e), false);
        document.addEventListener('keydown', (e) => this.onKeyDown_(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp_(e), false);
        this.canvas.addEventListener('click', () => this.canvas.requestPointerLock());
        document.addEventListener('pointerlockchange', () => this.onPointerLockChange_(), false);
        document.addEventListener('pointerlockerror', () => this.onPointerLockError_(), false);
    }

    onMouseDown_(e) {
        if (e.button === 0) {
            this.current_.leftButton = true;
        } else if (e.button === 2) {
            this.current_.rightButton = true;
        }
    }

    onMouseUp_(e) {
        if (e.button === 0) {
            this.current_.leftButton = false;
        } else if (e.button === 2) {
            this.current_.rightButton = false;
        }
    }

    onMouseMove_(e) {
        if (document.pointerLockElement === this.canvas) {
            this.current_.mouseX += e.movementX;
            this.current_.mouseY += e.movementY;

            if (this.previous_ === null) {
                this.previous_ = { ...this.current_ };
            }

            this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
            this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
        }
    }

    onKeyDown_(e) {
        this.keys_[e.keyCode] = true;
    }

    onKeyUp_(e) {
        this.keys_[e.keyCode] = false;
    }

    key(keyCode) {
        return !!this.keys_[keyCode];
    }

    onPointerLockChange_() {
        if (document.pointerLockElement === this.canvas) {
            console.log('Pointer lock enabled');
        } else {
            console.log('Pointer lock disabled');
        }
    }

    onPointerLockError_() {
        console.log('Pointer lock error');
    }

    update(_) {
        if (this.previous_ !== null) {
            this.current_.mouseXDelta = this.current_.mouseX - this.previous_.mouseX;
            this.current_.mouseYDelta = this.current_.mouseY - this.previous_.mouseY;
      
            this.previous_ = {...this.current_};
        }
    }
}


const KEYS = {
    'a': 65,
    's': 83,
    'w': 87,
    'd': 68,
    'q': 81,
    'e': 69,
  };


class FirstPersonControls {
    constructor(camera, canvas) {
        this.camera_ = camera;
        this.input_ = new InputController(canvas);
        this.rotation_ = new THREE.Quaternion();
        this.translation_ = new THREE.Vector3();
        this.phi_ = 0;
        this.theta_ = 0;
        this.phiSpeed_ = 8;
        this.thetaSpeed_ = 5;
        this.moveSpeed_ = 3; 
    }

    update() {
        this.input_.update();
        this.updateRotation_();
        this.updateCamera_();
        this.updateTranslation_(1 / 60);
    }

    updateCamera_(_) {
        this.camera_.quaternion.copy(this.rotation_);
        this.camera_.position.copy(this.translation_);
    }

    updateRotation_() {
        const xh = this.input_.current_.mouseXDelta / window.innerWidth;
        const yh = this.input_.current_.mouseYDelta / window.innerHeight;
    
        this.phi_ += -xh * this.phiSpeed_;
        this.theta_ = clamp(this.theta_ + -yh * this.thetaSpeed_, -Math.PI / 3, Math.PI / 3);
    
        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
        const qz = new THREE.Quaternion();
        qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta_);
    
        const q = new THREE.Quaternion();
        q.multiply(qx);
        q.multiply(qz);
    
        this.rotation_.copy(q);
    }

    updateTranslation_(timeElapsedS) {
        const forwardVelocity = (this.input_.key(KEYS.w) ? 1 : 0) + (this.input_.key(KEYS.s) ? -1 : 0)
        const strafeVelocity = (this.input_.key(KEYS.a) ? 1 : 0) + (this.input_.key(KEYS.d) ? -1 : 0)
        const verticalVelocity = (this.input_.key(KEYS.q) ? 1 : 0) + (this.input_.key(KEYS.e) ? -1 : 0)
    
        const qx = new THREE.Quaternion();
        qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi_);
    
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(qx);
        forward.multiplyScalar(forwardVelocity * timeElapsedS * this.moveSpeed_);
    
        const left = new THREE.Vector3(-1, 0, 0);
        left.applyQuaternion(qx);
        left.multiplyScalar(strafeVelocity * timeElapsedS * this.moveSpeed_);

        const up = new THREE.Vector3(0, 1, 0);
        up.applyQuaternion(qx);
        up.multiplyScalar(verticalVelocity * timeElapsedS * this.moveSpeed_);

        //todo: fix diagonal speeds
    
        this.translation_.add(forward);
        this.translation_.add(left);
        this.translation_.add(up);
    
        if (forwardVelocity != 0 || strafeVelocity != 0) {
          this.headBobActive_ = true;
        }
    }

    listenToKeyEvents() {
        return;
    }
}

export { FirstPersonControls };
