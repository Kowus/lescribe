<template>
  <div class="dashboard" v-if="project._id">
    <vuestic-widget class="no-padding no-v-padding">
      <div class="typo-headers">
        <div style="padding: 20px">
          <div class="float-right">
            <span class="badge badge-info" v-if="project.isPublic">{{'new.public' | translate}}</span>
            <span class="badge badge-danger" v-else>{{'new.private' | translate}}</span>
            <span class="badge badge-dark">{{moment(project.stats.startDate).format('MMM Do, YYYY')}}</span>
            <span class="badge badge-success" v-if="project.completed.status">{{'complete' | translate}}</span>
            <span class="badge badge-warning" v-else>{{'incomplete' | translate}}</span>
            
          </div>
          
          <h3>
            {{project.title}}
            <small class="settings-menu-dropdown">
              <div class="dropdown d-inline-flex" v-dropdown>
                <span type="button" class="dropdown-toggle theme-toggle" id="dropdownMenuButton" data-toggle="dropdown">
                  <!-- Settings -->
                  <i class="vuestic-icon vuestic-icon-settings"></i>
                </span>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <div class="dropdown-menu-content">
                    <a href="#" class="dropdown-item" @click.prevent="showCollaboratorModal()"><i class="entypo entypo-users" style="padding-right: 5px;"> </i> collaborators</a>
                  </div>
                </div>
              </div>
            </small>
          </h3>
          <div style="margin-left:3px; opacity:0.9;">
            <small class="text-info" style="margin-right:5px;padding:2px 5px;" :key="tag" v-for="tag in project.tags" :tag="tag">
              {{tag}}
               <sup><i class="fa fa-times remove-tag" @click="removeProjectTag(tag)"></i></sup>
            </small>
            <small class="badge">
              <input class="form-control" style="height: 25px; min-width: 100px; max-width: 130px;" :placeholder="$t('newTag')" @keyup.13="newTag('overview')" id="overview-tag">
            </small>
          </div>
          <hr style="clear: both">
          <div>
            <small>
              {{project.description}}
            </small>
          </div>
          <hr>
          <div>
            <div class="float-right">
              <a href class="badge" :class="cur_editing === 'overview'? 'badge-info': 'badge-dark'" @click.prevent="updateOverview('overview')">{{cur_editing === 'overview'? 'Save': 'Edit'}}</a>
            </div>
            <h5>Overview</h5>
            <div class="clearfix"></div>
            <vuestic-medium-editor @initialized="handleEditorInitialization" :contenteditable="cur_editing == 'overview'" v-html="project.overview" id="overview-content" @focus="cur_editing = 'overview'"/>
          </div>
        </div>
      </div>
    </vuestic-widget>

    <div class="float-right">
      <a class="badge badge-info" style="font-size: 14px;" @click.prevent="createNewSection">
          New Section
      </a>

    </div>
    <h6>
      Sections
    </h6>
      <hr style="clear: both">
    <vuestic-widget v-for="section in project.sections" :key="section._id" :section="section">
      <div>
        <div class="float-right">
          <a href class="badge badge-info" @click.prevent="updateSection(section.link._id)" v-if="cur_editing === section.link._id"> Save</a>
          <a href class="badge badge-dark" @click.prevent="updateSection(section.link._id)" v-else>Edit <i class="fa fa-pencil-square-o"></i></a>
        </div>
        <div class="form-group">
          <input class="form-control" v-model="section.link.title" @blur="handleTitleChange(section)" @keyup.13="handleTitleChange(section)" style="font-size:2em; height: 100%; font-weight: 600">
        </div>
        <small class="text-info" style="margin-right:5px;padding:2px 5px;" :key="tag" v-for="tag in section.link.tags" :tag="tag">{{tag}} <sup><i class="fa fa-times remove-tag" @click="removeSectionTag(section, tag)"></i></sup></small>
        <small class="badge">
          <input class="form-control" style="height: 25px; width: 100px; max-width: 150px;" :placeholder="$t('newTag')" @keyup.13="newTag(section.link._id, section)" :id="`${section.link._id}-tag`">
        </small>

        <hr class="small">
        <p id='apuskelenke'></p>
      </div>
      <vuestic-medium-editor @initialized="handleSectionInitialization" :contenteditable="cur_editing == section.link._id" v-html="section.link.body" :id="section.link._id"/>
    </vuestic-widget>

    <input type="file" accept="image/*" id="fileUploadDialog" name="files[]" style="display: none;">

    <vuestic-modal :show.sync="show" v-bind:small="false" v-bind:force="true" ref="collaboratorModal" :cancelClass="'none'"
                   okText="close">
      <div slot="title">Invite</div>
      <div>
        <!-- {{'modal.staticMessage' | translate}} -->
        <div style="width: 20%" class="float-right">
          <div class="collab-role" style="width: 100%; height: 100%;">
            <span v-for="(role, index) in collab_roles" :key="role.id" :role="role" v-if="collab_role === role.id" @click.prevent="toggleRole(index)">
              <i class="entypo" :class="`entypo-${role.icon}`"> </i>  {{role.label}}
            </span>
          </div>
        </div>
        <hr style="clear:both; opacity: 0;">
        <div class="form-group with-icon-left">
          <div class="input-group">
            <input id="input-icon-left" name="input-icon-left" required v-model="collabo"/>
            <i class="entypo entypo-user icon-left input-icon"></i>
            <label class="control-label" for="input-icon-left">Username, Full name, or Email</label>
            <i class="bar"></i>
            <div class="collab-results">
              <!-- {{collab_results}} -->
              <small class="help">
              <table class="table table-hover" v-if="collabo">
                <tr v-for="user in collab_results" :key="user._id" :user="user" class="pick-collaborator">
                  <td>
                    <img :src="user.profile_image || 'http://i.imgur.com/nfa5itq.png'" style="width: 40px; height: 40px; border-radius: 50px;"><br>
                    <router-link to="/">
                      @{{user.username}}
                    </router-link>
                    
                  </td>
                  <td>
                    <span class="text-capitalize">
                      {{`${user.given_name} ${user.family_name}`}}
                      <br>
                    </span>
                    {{user.email}}
                  </td>
                  <td>
                    <a href="#" @click.prevent="sendInvitation(user)">Add</a>
                  </td>
                  <hr>
                </tr>
              </table>
              </small>
            </div>
            <small class="help text-secondary">
              <br>
              <p>
                <em>These people already have access to this project:</em>
              </p>
              <table class="table">
                <tbody>
                  <tr v-for="collaborator in project.team" :key="collaborator.user._id" :collaborator="collaborator">
                    <td>
                        <img :src="collaborator.user.profile_image || 'http://i.imgur.com/nfa5itq.png'" style="width: 50px; height: 50px; border-radius: 50px;">
                    </td>
                    <td>
                      {{`${collaborator.user.given_name} ${collaborator.user.family_name}`}}
                      <br>
                      <router-link to="/">
                        @{{collaborator.user.username}}
                      </router-link>
                    </td>
                    <td class="text-capitalize">
                      {{collaborator.role}}
                    </td>
                  </tr>
                </tbody>
              </table>
            </small>
          </div>
        </div>
      </div>
    </vuestic-modal>
  </div>
</template>

<script>
/* eslint-disable */
import moment from 'moment'
let {randomBytes} = require('crypto')


export default {
  name: 'Overview',
  created(){
    this.getProject()
  },
  data(){
    return {
      project: {},
      editor: {},
      sections:[],
      cur_editing: '',
      edit_title: '',
      collabo: '',
      show: true,
      collab_results: [],
      collab_role:'readwrite',
      collab_roles: [
        {
          role: 'readwrite',
          id: 'readwrite',
          label: 'Edit',
          icon: 'pencil'
        },
        {
          role: 'readonly',
          id: 'readonly',
          label: 'View',
          icon: 'eye'
        },
        {
          role: 'admin',
          id: 'admin',
          label: 'Admin',
          icon: 'cog'
        }
      ]
    }
  },
  methods: {
    editorOptions(){
      return {
        autoLink: true,
        buttonLabels: 'fontawesome',               
      }
    },
    showCollaboratorModal(){
      this.$refs.collaboratorModal.open()
    },
    toggleRole(index){
      let roleLength = this.collab_roles.length;
      let modulo_index = (Number(index) +1) % roleLength;
      const {role} = this.collab_roles[modulo_index];
      this.collab_role = role;
    },
    sendInvitation(user){
      this.$http.post(`/projects/${this.project._id}/invite`, {
        user: user._id,
        role: this.collab_role
      }).then(res=>{
        this.project.team.push({
          _id: user._id,
          family_name:user.family_name,
          given_name: user.given_name,
          role: this.collab_role,
          username: user.username
        });
        alert(res.data);
      })
    },
    createNewSection(){
      let section = {
          title: `New Section ${moment().format('MMMM Do, YYYY')}`,
          body: 'Start typing now'
        };
      this.$http
          .post(`/projects/${this.project._id}/create-section`, section)
          .then(res => {
            const newSection = res.data;
            this.project.sections.unshift({link: newSection});
            console.log(newSection)
          });
    },
    getProject(){
      this.$http
        .get(`/projects/${this.$route.params.project}`)
        .then(res => {
          this.project = res.data
        });
    },
    handleTitleChange(section){
      // alert(section.link.title)
      let route = `/sections/${section.link._id}/update`;
      let payload = {
          project: this.project._id,
          content: section.link.title,
          target: 'title'
        };
      this.updateProject({route,payload})
        .then(res=>{
          console.log('Success!!!')
        })
        .catch(res=>{})
    },
    handleEditorInitialization (editor) {
      this.editor = editor
      this.$nextTick(() => {
          // this.highlightSampleText()
      })
    },
    handleSectionInitialization(editor){
      this.sections.push(editor)
    },
    moment,
    updateOverview(id){
      if (this.cur_editing === id){
        let origEl = this.editor.origElements.innerHTML;
        let route = `/projects/${this.project._id}/update`;
        let payload = {
          target: 'overview',
          content: origEl
        }
        this.updateProject({route, payload})
                .then(res => {
                  // this.$message("Successfully updated overview!");
                  console.log('Success')
                })
                .catch(res => {
                  // this.$message.error("Error updating overview!");
                    console.error(res);
                });
                this.cur_editing = '';
      }else {
        this.cur_editing = id
        this.$nextTick(() => {
          document.getElementById('overview-content').focus();
        })
      }
    },
    updateSection(id){
      if (this.cur_editing === id){
        let origEl = document.getElementById(id)
        let section_body = origEl.innerHTML
        // console.log(section_body)
        let route = `/sections/${id}/update`
        let payload = {
          project: this.project._id,
          content: section_body,
          target: 'body'
        }
        this.updateProject({route, payload}).then((result) => {
          this.cur_editing = ''
        }).catch((err) => {
          // handle errors
        });
      } else{
        this.cur_editing = id;
        this.$nextTick(() => {
          document.getElementById(id).focus();
        })
      }
    },
    newTag(id, section){
      let tagInput = document.getElementById(id+'-tag').value;
      let tagContent = tagInput.toString();
      let route;
      let payload;
      if(tagContent === '' || tagContent===' '){
        return;
      }
      tagContent = tagContent.toLowerCase().split(' ').join('-')
      if(id === 'overview') {
        route = `/projects/${this.project._id}/update`;
        if(this.project.tags.includes(tagContent)) return;
        this.project.tags.push(tagContent);
        payload = {
          target: 'tags',
          content: this.project.tags
        }
      }else{
        route = `/sections/${section.link._id}/update`;
        if(section.link.tags.includes(tagContent)) return;
        section.link.tags.push(tagContent);
        payload = {
          target: 'tags',
          content: section.link.tags,
          project: this.project._id
        }
      }
      this.updateProject({route,payload})
        .then(res=>{
          document.getElementById(id+'-tag').value = '';
        })
        .catch(res=>{
          // handle errors
        })
    },
    updateProject(arg){
      return this.$http.patch(arg.route, arg.payload)
    },
    removeSectionTag(section, tag){
      section.link.tags.splice(section.link.tags.indexOf(tag), 1);
      let route = `/sections/${section.link._id}/update`;
      let payload = {
        target: 'tags',
        content: section.link.tags,
        project: this.project._id
      }
      this.updateProject({route, payload}).then((result) => {
        // nothing
      }).catch((err) => {
        // nothing
      });
    },
    removeProjectTag(tag){
      this.project.tags.splice(this.project.tags.indexOf(tag), 1);
      let route = `/projects/${this.project._id}/update`;
      let payload = {
        target: 'tags',
        content: this.project.tags
      }
      this.updateProject({route, payload}).then((result) => {
        // nothing
      }).catch((err) => {
        // nothing
      });
    },
    getCollaborator(name){
      this.$http.get(`/search`,{params:{target: 'user', content: name}})
      .then((results) => {
        this.collab_results = results.data;
      })
      .catch((err) => {

      })
    }
  },
  watch: {
    $route: 'getProject',
    collabo(){
      this.getCollaborator(this.collabo)
    }
  }

}
</script>

<style lang="scss">
.remove-tag {
  color: #ccc;
  font-size: 1.3em;
  cursor: pointer;
  &:hover {
    color: #e34a4a
  }
}
.settings-menu-dropdown {
  color: #ccc;
  cursor: pointer;
  font-size: 12px;
  &:hover {
    color: #333
  }
}

.collab-results{
  height: 200px;
  padding: 10px 0;
  // border: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: scroll;
  background-color: #fff;
  box-shadow: 3px 3px 5px #555;

  .pick-collaborator{
    padding: 0;
    cursor: pointer;
    &:hover{
      background: rgba(200,200,200,0.2)
    }
  }
}
  .collab-role{
    color: #777;
    padding: 4px 2px;
    text-align: center;
    background-color: transparent;
    box-shadow: 1px 2px 1px #ddd;
    -moz-box-shadow: 1px 2px 1px #ddd;
    -o-box-shadow: 1px 2px 1px #ddd;
    -webkit-box-shadow: 1px 2px 1px #ddd;
    cursor: pointer;
    font-weight: lighter;
    &:hover{
      font-weight: 700;
      box-shadow: 2px 2px 1px #ddd;
      -moz-box-shadow: 2px 2px 1px #ddd;
      -o-box-shadow: 2px 2px 1px #ddd;
      -webkit-box-shadow: 2px 2px 1px #ddd;
    }
  }
</style>
