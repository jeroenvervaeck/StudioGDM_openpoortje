import { default as React, useState } from 'react';
import './Supervisor#.scss';
import Board from '../../components/stickers/Board'
import { useHistory } from 'react-router-dom'

const Supervisor13Fiche = () => {
	const history = useHistory();
	const [kid, setKid] = useState()

	const kidObj = JSON.parse(sessionStorage.getItem('selected-kid'))
	console.log(kidObj);


	return (
		<div className="supervisor-13">
			<Board 
				onSave={(screenshot) => { console.log(screenshot) }}
				onBack={() => history.goBack()} 
			/>

			{/* Animation will be here */}

		</div>
	);
	
};

export default Supervisor13Fiche;
