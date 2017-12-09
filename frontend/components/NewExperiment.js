import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    };
  }

  submit(e) {
    e.preventDefault();
    axios.post('/api/experiment', {
      name: e.target.name.value,
      password: e.target.password.value,
      description: e.target.desc.value || null
    }).then(resp => {
      console.log(resp);
      if (resp.data.success) this.setState({ submitted: true });
    }).catch(err => console.log(err));
  }

  render() {
    if (this.state.submitted) return <Redirect to="/" />;

    return (
      <div>
        <h3>Create a new Experiment</h3>
        <form className="col form" onSubmit={e => this.submit(e)}>
          <input type="text" name="name" placeholder="Experiment Name" />
          <input type="password" name="password" placeholder="Experiment Password" />
          <input type="text" name="desc" placeholder="Description of your experiment" />
          <input type="submit" />
        </form>
        <Link to="/">Back to Experiments</Link>
      </div>
    );
  }
}

export default Register;
