/*
@flow
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';;
import { LoadingBar, showLoading, hideLoading } from 'react-redux-loading-bar';
import MobileWebPanel from '../components/MobileWebPanel';
import CallPanel from '../components/CallPanel';
import ServerList from '../components/ServerList';
import ServerState from '../components/ServerState';
import EmailDialog from '../components/EmailDialog';
import RequestErrorDialog from '../components/RequestErrorDialog';
import { ERROR_REQ_ONCALL, ERROR_REQ_TICKETS } from '../library/errorMessage';
import { Grid, Row, Glyphicon, Button } from 'react-bootstrap';
import {
  requestMobileBranchList, selectMobileBranch,
  requestStagingStatus, selectDeployTarget,
  requestTicketStatus, requestOnCaller,
  addServerState, clearServerState,
  addStoryPoint, clearStoryPoint,
  addStagingTickets, clearStagingTickets,
  sendEmail, showEmailDialog, errorClear
} from '../actions';

//Defining Props type use FlowJs
type Props = {
    mobileInfo: Object,
    serverInfoList: Object,
    selectedMobileBranch: string,
    selectedDeployTarget: string,
    ticketStatus: Object,
    callList: Object,
    serverState: Array<Object>,
    storyPoint: Object,
    stagingTickets: Array<Object>,
    isShowEmailDialog: boolean,
    sendCompleteEmail: boolean,
    errorRequest: string,
    loadingBar: any,
    dispatch: () => void
};

class AsyncApp extends Component {

  props: Props;
  state: Object;

  handleRequest: () => void;
  handleChangeBranch: () => void;
  handleChangeTarget: () => void;
  handleLoadedServer: () => void;
  handleRequestCaller: () => void;
  handleServerState: () => void;
  handleStoryPoint: () => void;
  handleStagingTickets: () => void;
  handleSendEmail: () => void;
  handleShowEmailDialog: () => void;
  handleRequestRefesh: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      tickets: []
    };
    this.handleRequest = this.handleRequest.bind(this);
    this.handleChangeBranch = this.handleChangeBranch.bind(this);
    this.handleChangeTarget = this.handleChangeTarget.bind(this);
    this.handleLoadedServer = this.handleLoadedServer.bind(this);
    this.handleRequestCaller = this.handleRequestCaller.bind(this);
    this.handleServerState = this.handleServerState.bind(this);
    this.handleStoryPoint = this.handleStoryPoint.bind(this);
    this.handleStagingTickets = this.handleStagingTickets.bind(this);
    this.handleSendEmail = this.handleSendEmail.bind(this);
    this.handleShowEmailDialog = this.handleShowEmailDialog.bind(this);
    this.handleRequestRefesh = this.handleRequestRefesh.bind(this);
  }

  componentDidMount(): void {
    this.handleRequest();
  }

  componentWillReceiveProps(nextProps): void {
    if (!this.props.sendCompleteEmail && nextProps.sendCompleteEmail) {
      this.props.dispatch(showEmailDialog(false));
    }
  }
  componentDidUpdate(prevProps, prevState) {
    //this.props.dispatch(showLoading());
    const { dispatch, ticketStatus, errorRequest, callList } = this.props;
    //console.log('componentDidUpdate:', prevProps, this.props, JSON.stringify(prevProps) == JSON.stringify(this.props));
    if ((!prevProps.ticketStatus.isLoading && ticketStatus.isLoading)
        || (!prevProps.callList.isLoading && callList.isLoading)
        || errorRequest) {
      dispatch(hideLoading());
    }
  }

  handleRequest(): void {
    const { dispatch } = this.props;
    dispatch(showLoading());
    dispatch(clearServerState());
    dispatch(clearStagingTickets());
    dispatch(clearStoryPoint());
    dispatch(requestMobileBranchList());
    dispatch(requestStagingStatus());
  }
  handleRequestCaller() {
    this.props.dispatch(showLoading());
    this.props.dispatch(requestOnCaller());
  }
  handleChangeBranch(selectBranch) {
    this.props.dispatch(selectMobileBranch(selectBranch));
  }
  handleChangeTarget(selectTarget) {
    this.props.dispatch(selectDeployTarget(selectTarget));
  }
  handleLoadedServer(tickets) {
    this.setState({ tickets });
    this.props.dispatch(requestTicketStatus(tickets));
  }
  handleServerState(server, enableUseBackEnd, enableUseMobileWeb) {
    this.props.dispatch(addServerState(server, enableUseBackEnd, enableUseMobileWeb));
  }
  handleStoryPoint(server, bPoint, mPoint) {
    this.props.dispatch(addStoryPoint(server, bPoint, mPoint));
  }
  handleStagingTickets(tickets) {
    this.props.dispatch(addStagingTickets(tickets));
  }
  handleSendEmail(data) {
    this.props.dispatch(sendEmail(data));
  }
  handleShowEmailDialog(show) {
    this.props.dispatch(showEmailDialog(show));
  }
  handleRequestRefesh(type) {
    this.props.dispatch(errorClear());
    if (type == ERROR_REQ_ONCALL) {
      setTimeout(function() { this.handleRequestCaller(); }.bind(this), 500);
    } else if (type == ERROR_REQ_TICKETS) {
      setTimeout(function() {
        this.props.dispatch(showLoading());
        this.props.dispatch(clearServerState());
        this.props.dispatch(clearStagingTickets());
        this.props.dispatch(clearStoryPoint());
        this.handleLoadedServer(this.state.tickets);
      }.bind(this), 500);
    } else {
      setTimeout(function() { this.handleRequest(); }.bind(this), 500);
    }
  }

  render() {
    const { mobileInfo, serverInfoList, selectedMobileBranch,
            selectedDeployTarget, ticketStatus, callList,
            serverState, storyPoint, stagingTickets, isShowEmailDialog,
            errorRequest, loadingBar } = this.props;
    return (
      <div>
        <header>
          <LoadingBar style={{ position: 'fixed', top: '0px' }} loading={loadingBar}/>
        </header>
        <Grid>
          <Row>
            <CallPanel
              callList={callList}
              onRequestCaller={this.handleRequestCaller} />
          </Row>
          <Row>
            <MobileWebPanel
              mobileWebSHA1={serverInfoList.mobileWebSHA1}
              selectedMobileBranch={selectedMobileBranch}
              selectedDeployTarget={selectedDeployTarget}
              branchs={mobileInfo.branchs}
              targets={serverInfoList.targets}
              isBranchLoading={mobileInfo.isLoading}
              isTargetLoading={serverInfoList.isLoading}
              onChangeBranch={this.handleChangeBranch}
              onChangeTarget={this.handleChangeTarget} />
          </Row>
          <Row>
            <ServerState
              serverState={serverState}
              onRefresh={this.handleRequest} />
          </Row>
          <Row>
            <ServerList
              loading={serverInfoList.isLoading}
              servers={serverInfoList.servers}
              onLoaded={this.handleLoadedServer}
              onServerState={this.handleServerState}
              onStoryPoint={this.handleStoryPoint}
              onStagingTickets={this.handleStagingTickets}
              onEmailDialogShow={this.handleShowEmailDialog}
              storyPoint={storyPoint}
              tickets={ticketStatus} />
          </Row>
        </Grid>
        <Button className="btn_top" href="#root" bsStyle="warning"><Glyphicon glyph="eject" /></Button>
        <EmailDialog
          stagingTickets={stagingTickets}
          isShowEmailDialog={isShowEmailDialog}
          onEmailDialogShow={this.handleShowEmailDialog}
          stagingSHA1={serverInfoList.backEndSHA1}
          onSendEmail={this.handleSendEmail}/>
        <RequestErrorDialog
          reqType={errorRequest}
          onRequestRefesh={this.handleRequestRefesh} />
      </div>
    );
  }
}

/*
React : Typechecking With PropTypes
AsyncApp.PropTypes = {
    mobileInfo: PropTypes.object.isRequired,
    serverInfoList: PropTypes.object.isRequired,
    selectedMobileBranch: PropTypes.string.isRequired,
    selectedDeployTarget: PropTypes.string.isRequired,
    ticketStatus: PropTypes.object.isRequired,
    callList: PropTypes.object.isRequired,
    serverState: PropTypes.array.isRequired,
    storyPoint: PropTypes.object.isRequired,
    stagingTickets: PropTypes.array.isRequired,
    isShowEmailDialog: PropTypes.bool.isRequired,
    sendCompleteEmail: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
};
*/

function mapStateToProps(state) {
  const { mobileInfo, serverInfoList, selectedMobileBranch,
          selectedDeployTarget, ticketStatus, callList,
          serverState, storyPoint, stagingTickets,
          isShowEmailDialog, sendCompleteEmail,
          errorRequest, loadingBar } = state;
  return {
    mobileInfo,
    selectedMobileBranch,
    serverInfoList,
    selectedDeployTarget,
    ticketStatus,
    callList,
    serverState,
    storyPoint,
    stagingTickets,
    isShowEmailDialog,
    sendCompleteEmail,
    errorRequest,
    loadingBar
  };
}

export default connect(mapStateToProps)(AsyncApp);

