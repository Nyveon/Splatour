import styled from "@emotion/styled";

const s = {
	PointerLockControls: styled.div`
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		cursor: none;
		background-color: red;
	`,
};

export default function PointerLockControls() {
	return <s.PointerLockControls></s.PointerLockControls>;
}
