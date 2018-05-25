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
            <h4>Overview</h4>

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
      project: {}
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
    moment
  },
  watch: {
    $route: 'getProject'
  }

}
</script>
