import React from 'react';
import { useHistory } from 'react-router-dom';

function Item(dataCourse){
	const history = useHistory();
	var [id, title, modules_len, shown, description, image, path] = dataCourse.dataCourse;
	console.log('zz', image)
	if (image == '') {
		console.log('imimimim')
		image = "/frontend/static/images/fon4.jpg"
	}

	return (
		<div className="item" onClick={e =>  {
			history.push(path)
		}}>
			<div className="card-wrapper">
				<div className="card-image">
					<img src={image} alt="обложка"/>
				</div>
				<div className="content">
					<strong>{title}</strong>
					<br/>
					<p style={{fontSize:"0.8em", color:"var(--color-foreground-3)", hyphens: "auto", textAlign:"justify"}} lang="ru">
						{description}
					</p>
				</div>
			</div>
		</div>
	);
}

export default Item;
