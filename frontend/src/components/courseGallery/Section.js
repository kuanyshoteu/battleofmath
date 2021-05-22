import React from 'react';
import CourseList from './CourseList.js';

function Section(section) {

	const dataList = section.section
	console.log('z44', section.section, dataList)

	return (
		<section>
			{
				dataList.map((data) => 
					<div key={data} className="courselist">{ <CourseList data={data}/> } </div>
				)
			}
		</section>
	);
}

export default Section;