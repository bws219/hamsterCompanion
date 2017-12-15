import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class EditExperiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      error: '',
      name: '',
      desc: '',
      edit: false,
    };
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      axios.get('/api/experiment/' + this.props.match.params.id).then(resp => {
        this.setState({
          name: resp.data.name,
          desc: resp.data.description,
          edit: true
        });
      });
    }
  }

  submit(e) {
    e.preventDefault();
    if (this.state.edit) {
      if (!e.target.adminPasswordCheck.value) {
        this.setState({ error: 'Admin password required to edit' });
      } else {
        // TODO EDIT EXPERIMENT ON SERVER SIDE
      }
    } else {
      if (e.target.adminPassword.value === e.target.adminPassRepeat.value) {
        axios.post('/api/experiment', {
          name: e.target.name.value,
          password: e.target.password.value,
          description: e.target.desc.value || null,
          adminPassword: e.target.adminPassword.value
        }).then(resp => {
          if (resp.data.success) this.setState({ submitted: true });
        }).catch(err => console.log(err));
      } else this.setState({ error: 'Admin passwords do not match!'});
    }
  }

  changeName(e) { this.setState({ name: e.target.value }); }

  changeDesc(e) { this.setState({ desc: e.target.value }); }

  render() {
    if (this.state.submitted) return <Redirect to="/" />;

    return (
      <div>
        <h3>Create or edit an Experiment</h3>
        { this.state.error ? <p style={{ color: 'red' }}>{this.state.error}</p> : null }
        <form className="col form" onSubmit={e => this.submit(e)}>
          <input type="text" name="name" onChange={e => this.changeName(e)}
            placeholder="Experiment Name" value={this.state.name}
          />
          <input type="password" name="password" placeholder="Password to Join Experiment" />
          <input type="text" name="desc" onChange={e => this.changeDesc(e)}
            placeholder="Description of your experiment" value={this.state.desc}
          />
          <input type="password" name="adminPassword" placeholder="Admin Password" />
          <input type="password" name="adminPassRepeat" placeholder="Repeat Admin Password" />
          { this.state.edit ?
            <p>In order to edit this experimgnt you must enter the admin password:</p>
            : null }
          { this.state.edit ?
            <input type="password" name="adminPasswordCheck" />
            : null }
          <input type="submit" />
        </form>
        <Link className="box btn" to="/">Cancel</Link>
      </div>
    );
  }
}

export default EditExperiment;
