import React from 'react';
import Item from './Item.js';

function CourseList(data) {
	const title = data.data[0]
	const dataListCourse = data.data[1][0]
	console.log('course', data.data)

	return (
		<div className="courseList">
			<h3>{title}</h3>		
			<div className="list">
				{
					dataListCourse.map((dataCourse) => 
						<div key={dataCourse} className="course">{ <Item dataCourse={dataCourse}/> } </div>
					)
				}
			</div>
		</div>
	);
}

export default CourseList;