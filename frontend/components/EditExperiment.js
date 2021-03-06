import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { RaisedButton, Dialog } from 'material-ui';
import axios from 'axios';

class EditExperiment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      error: '',
      name: '',
      desc: '',
      isAdmin: null,
      adminPassword: '',
      modalOpen: false,
      deleted: false
    };
  }

  componentWillMount() {
    axios.get(`/api/experiment/${this.props.match.params.id}/edit`)
      .then((resp) => {
        this.setState({
          name: resp.data.experiment.name,
          desc: resp.data.experiment.description,
          edit: true,
          isAdmin: true
        });
      })
      .catch((err)=>{
        console.log(err);
        this.setState({
          isAdmin: false
        });
      });
  }

  submit(e) {
    e.preventDefault();
    if (!e.target.adminPasswordCheck.value) {
      this.setState({ error: 'Admin password required to edit' });
    }
    else {
      const body = {
        name: this.state.name || null,
        description: this.state.desc || null,
        currentAdminPassword: this.state.adminPassword
      };
      if (e.target.password.value) body.password = e.target.password.value;
      if (e.target.adminPassword.value) {
        if (e.target.adminPassword.value !== e.target.adminPassRepeat.value) {
          this.setState({ error: 'Admin passwords must match!'});
          return;
        }
        body.adminPassword = e.target.adminPassword.value;
      }
      axios.post(`/api/experiment/${this.props.match.params.id}/edit`, body)
        .then(resp => {
          if (resp.data.success) this.setState({ submitted: true });
          else this.setState({ error: resp.data.error });
        }).catch(err => console.log(err));
    }
  }

  changeName(e) { this.setState({ name: e.target.value }); }

  changeDesc(e) { this.setState({ desc: e.target.value }); }

  changeAdminPassword(e) { this.setState({ adminPassword: e.target.value }); }

  toggleModal() {
    if(!this.state.modalOpen && !this.state.adminPassword) {
      this.setState({
        error: 'Admin password required to delete experiment.'
      });
    }
    else{
      this.setState({
        modalOpen: !this.state.modalOpen
      });
    }
  }

  deleteExperiment() {
    axios.post(`/api/experiment/${this.props.match.params.id}/delete`, {
      adminPassword: this.state.adminPassword
    }).then((resp)=>{
      this.setState({
        deleted: resp.data.success,
        error: resp.data.error || '',
        modalOpen: false
      });
    }).catch(()=>{
      this.setState({
        error: 'Something went wrong. Experiment not deleted',
        modalOpen: false
      });
    });
  }

  render() {
    if(this.state.deleted === true) {
      return <Redirect to={'/'}/>;
    }

    if(this.state.isAdmin === null) {
      return null;
    }
    if (this.state.isAdmin === false) {
      return <Redirect to={'/denied'} />;
    }

    if (this.state.submitted) {
      return <Redirect to={`/experiment/${this.props.match.params.id}`} />;
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <h3>Edit Experiment</h3>
        { this.state.error ? <p style={{ color: 'red' }}>{this.state.error}</p> : '' }
        <form className="col form" onSubmit={e => this.submit(e)}>
          <input type="text" name="name" onChange={e => this.changeName(e)}
            placeholder="Experiment Name" value={this.state.name || ''}
          />
          <input type="password" name="password" placeholder="Password to Join Experiment"/>
          <input type="text" name="desc" onChange={e => this.changeDesc(e)}
            placeholder="Description of your experiment" value={this.state.desc || ''}
          />
          <input type="password" name="adminPassword" placeholder="New Admin Password"/>
          <input type="password" name="adminPassRepeat" placeholder="Repeat New Admin Password"/>
          <p>In order to edit this experimgnt you must enter the current admin password:</p>
          <input type="password" name="adminPasswordCheck" placeholder="Current Admin Password"
            onChange={e => this.changeAdminPassword(e)} value={this.state.adminPassword}
          />
          <RaisedButton label="Submit" primary type="submit" />
          <RaisedButton label="Delete Experiment" onClick={()=>this.toggleModal()} secondary />
        </form>
        <Link to={`/experiment/${this.props.match.params.id}`}>
          <RaisedButton className="btn" label="Cancel" secondary />
        </Link>

        <Dialog open={this.state.modalOpen} modal title="Warning!"
          children={<p>This action will delete the experiment and all data associated with it. Do you wish to proceed?</p>}
          actions={[
            <RaisedButton label="Cancel" onClick={()=>this.toggleModal()} primary/>,
            <RaisedButton label="Delete" onClick={()=>this.deleteExperiment()} secondary/>
          ]}
        />
      </div>
    );
  }
}

export default EditExperiment;
