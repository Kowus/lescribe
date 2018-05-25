<template>
  <div class="dashboard" v-if="project._id">
    <vuestic-widget class="no-padding no-v-padding">
      <div class="typo-headers">
        <div style="padding: 20px">
          <div class="float-right">
            <span class="badge badge-warning" v-if="project.ispublic">Public</span>
            <span class="badge badge-danger" v-else>Private</span>
            <span class="badge badge-info">{{moment(project.stats.startDate).format('MMM Do, YYYY')}}</span>
            <span class="badge badge-primary" v-if="project.completed.status">Completed</span>
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
            <h5>Overview</h5>
            <vuestic-medium-editor @initialized="handleEditorInitialization" :editor-options="editorOptions" v-html="project.overview">

            </vuestic-medium-editor>
          </div>

        </div>
      </div>
    </vuestic-widget>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Overview',
  created(){
    this.getProject()
  },
  data(){
    return {
      project: {},
      editor:{},
      editorOptions:{
        autoLink: true,
        buttonLabels: 'fontawesome',
        toolbar: {
          buttons: [
            'bold',
            'italic',
            'underline',
            'anchor',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'quote',
            'outdent',
            'indent',
            'spreadsheet'
          ]
        }
      }
    }
  },
  methods: {
    getProject(){
      this.$http
        .get(`/projects/${this.$route.params.project}`)
        .then(res => {
            // this.$store.commit("setCurrentProject", res.data);
          this.project = res.data
        });
    },
    handleEditorInitialization (editor) {
        this.editor = editor
        this.$nextTick(() => {
          // this.highlightSampleText()
        })
      },
    moment
  },
  watch: {
    $route: 'getProject'
  }

}
</script>
