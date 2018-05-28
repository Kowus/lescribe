<template>
  <div class="dashboard" v-if="project._id">
    <vuestic-widget class="no-padding no-v-padding">
      <div class="typo-headers">
        <div style="padding: 20px">
          <div class="float-right">
            <span class="badge badge-info" v-if="project.isPublic">Public</span>
            <span class="badge badge-danger" v-else>Private</span>
            <span class="badge badge-dark">{{moment(project.stats.startDate).format('MMM Do, YYYY')}}</span>
            <span class="badge badge-success" v-if="project.completed.status">Completed</span>
            <span class="badge badge-warning" v-else>Incomplete</span>
          </div>
          <h3>{{project.title}}</h3>
          <div style="margin-left:3px; opacity:0.9;">
            <small class="text-info" style="margin-right:5px;padding:2px 5px;" :key="tag" v-for="tag in project.tags" :tag="tag">{{tag}}</small>
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
            <vuestic-medium-editor @initialized="handleEditorInitialization" :editor-options="editorOptions" :contenteditable="cur_editing == 'overview'" v-html="project.overview"/>
          </div>
        </div>
      </div>
    </vuestic-widget>

    <small>
      Sections<hr>
    </small>

    <vuestic-widget class="" v-for="section in project.sections" :key="section._id" :section="section">
      <div>
        <h3>{{section.link.title}}</h3>
        <hr class="small">
      </div>
    </vuestic-widget>


  </div>
</template>

<script>
/* eslint-disable */
import Autolist from 'medium-editor-autolist'
import Spreadsheet from 'medium-editor-handsontable'
import moment from 'moment'


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
      editorOptions: {
        autoLink: true,
        buttonLabels: 'fontawesome',
        disableEditing: true,
        extensions: {
          spreadsheet: new Spreadsheet(),
          autolist: new Autolist()
        },
        spellcheck: true,
        toolbar: {
          buttons: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'subscript',
            'superscript',
            'anchor',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'quote',
            'justifyLeft',
            'justifyCenter',
            'justifyRight',
            'justifyFull',
            'outdent',
            'indent',
            'orderedlist',
            'unorderedlist',
            'spreadsheet'
          ],
          static: true,
          sticky: true,
          updateOnEmptySelection: true
        }
      }
    }
  },
  methods: {
    getProject(){
      this.$http
        .get(`/projects/${this.$route.params.project}`)
        .then(res => {
          this.project = res.data
        });
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
        this.$http
                .patch(`/projects/${this.project._id}/update`, {
                  target: 'overview',
                  content: origEl
                })
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
      }
    }
  },
  watch: {
    $route: 'getProject'
  }

}
</script>
