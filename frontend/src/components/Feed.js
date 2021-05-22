import React, {useState} from 'react';
import Section from './courseGallery/Section.js';

function Feed() {
	const [data, changeData] = useState(false);

	fetch("/teacher/library/api/get_library/").then(
		result => result.json()
	).then(
		json => work(json)
	)
	function work(json){
		if (data == false) {
			changeData(json.subjects)
		}
	}
	return (
		<div className="one">
			<div className="two">
				<div className="three">
				{
					data && <Section section={data}/>
				}
				</div>
			</div>
		</div>
	);
}

export default Feed;
