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
          <h3>{{project.title}}</h3>
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

    <input type="file" id="fileUploadDialog" name="files[]" multiple style="display: none;">
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
      edit_title: ''
    }
  },
  methods: {
    editorOptions(){
      return {
        autoLink: true,
        buttonLabels: 'fontawesome',
       
        
      }
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
        }
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
    }
  },
  watch: {
    $route: 'getProject'
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
</style>
