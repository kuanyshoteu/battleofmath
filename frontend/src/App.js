import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header.js';
import Toggle from './components/Toggle.js';
import Sidebar from './components/Sidebar.js'
import Feed from './components/Feed.js'

function App() {
return (
	<div className="App">
		<Router>
			<Header/>
			<Toggle/>
			<Sidebar/>
			<main className="main">
				<Switch>
					<Route path="/courses" exact>
						<Feed/>
					</Route>
					// <Route path="/~" exact>
					// </Route>
					// <Route path="/~" exact>
					// </Route>
					// <Route path="/~" exact>
					// </Route>
					<Route path="/donate" exact>
					</Route>
				</Switch>
			</main>
		</Router>
	</div>
);
}

export default App;
