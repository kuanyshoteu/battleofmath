import React from 'react';

function Toggle() {
function toggle(){
	let element = document.querySelector(".sidebar");
	let element2 = document.querySelector(".sb-header");
	let element3 = document.querySelector("body");


	let classes = [...element.classList];
	
	if(classes.find(e => e === "open")){
		element.classList.remove("open");
		element2.classList.remove("open");
		element3.classList.remove("open-sidebar");
	}else{
		element.classList.add("open");
		element2.classList.add("open");
		element3.classList.add("open-sidebar");
	}
}

return (
	<div className="toggle">
		<button onClick={toggle}>
			<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="svg-inline--fa fa-bars fa-w-14 fa-3x"><path fill="currentColor" d="M442 114H6a6 6 0 0 1-6-6V84a6 6 0 0 1 6-6h436a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6zm0 160H6a6 6 0 0 1-6-6v-24a6 6 0 0 1 6-6h436a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6zm0 160H6a6 6 0 0 1-6-6v-24a6 6 0 0 1 6-6h436a6 6 0 0 1 6 6v24a6 6 0 0 1-6 6z" className=""></path></svg>
		</button>
	</div>
);
}

export default Toggle;
