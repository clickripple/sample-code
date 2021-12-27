import React, { Component } from "react";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import Button from "@material-ui/core/Button";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { toaster } from "../../helper/Toaster";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import { CMS, getCMS } from "../../actions/login";
let addEditFlag = false;
export class PrivacyPolicyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      en_policy: "",
      es_policy: "",
      cms_id: "",
    };
  }

  componentWillMount() {
    this.props.getCMS();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { cms_response, get_cms } = newProps;
    if (cms_response && cms_response.status === 200 && addEditFlag) {
      toaster("success", cms_response.message);
      this.props.getCMS();
      addEditFlag = false;
    } else if (cms_response && cms_response.status === 404 && addEditFlag) {
      toaster("error", cms_response.message);
      addEditFlag = false;
    }

    if (get_cms && get_cms.status === 200) {
      this.setState({
        en_policy: get_cms.cms_data && get_cms.cms_data.en_policy,
        es_policy: get_cms.cms_data && get_cms.cms_data.es_policy,
        cms_id: get_cms.cms_data && get_cms.cms_data.id,
      });
    } else if (get_cms && get_cms.status === 404) {
      toaster("error", get_cms.message);
    }
  }

  handleEditorChange = (e, name) => {
    this.setState({ [name]: e.target.getContent() });
  };
  submitData = () => {
    let { en_policy, es_policy, cms_id } = this.state;
    if (cms_id === null) {
      let params = {
        en_policy: en_policy,
        es_policy: es_policy,
      };
      this.props.CMS(params, "add");
    } else {
      let params = {
        en_policy: en_policy,
        es_policy: es_policy,
        id: cms_id,
      };
      this.props.CMS(params, "edit");
    }
    addEditFlag = true;
  };

  render() {
    const { en_policy, es_policy } = this.state;
    return (
      <GridContainer>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        <GridItem xs={12} sm={12} md={12}>
          <p>English</p>
          <Card>
            <CardBody>
              <Editor
                initialValue={en_policy}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help",
                }}
                onChange={(e) => this.handleEditorChange(e, "en_policy")}
              />
            </CardBody>
            <CardFooter>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.submitData()}
              >
                Primary
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <p>Spanish</p>
          <Card>
            <CardBody>
              <Editor
                initialValue={es_policy}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help",
                }}
                onChange={(e) => this.handleEditorChange(e, "es_policy")}
              />
            </CardBody>
            <CardFooter>
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.submitData()}
              >
                Primary
              </Button>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    cms_response: store.login.cms_response,
    get_cms: store.login.get_cms,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    CMS: (params, flag) => dispatch(CMS(params, flag)),
    getCMS: () => dispatch(getCMS()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicyPage);
