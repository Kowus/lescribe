<template>
  <div class="dashboard">
<!--
    <dashboard-info-widgets></dashboard-info-widgets>
-->
    <vuestic-widget class="no-padding no-v-padding" v-for="project in currentUser.projects" :project="project" :key="project._id">
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
        </div>
      </div>
    </vuestic-widget>
<!--
    <vuestic-widget class="no-padding no-v-padding">
      <vuestic-tabs
        :names="[$t('dashboard.dataVisualization'), $t('dashboard.usersAndMembers'), $t('dashboard.setupProfile'), $t('dashboard.features')]"
        ref="tabs">
        <div :slot="$t('dashboard.dataVisualization')">
          <data-visualisation-tab></data-visualisation-tab>
        </div>
        <div :slot="$t('dashboard.usersAndMembers')">
          <users-members-tab></users-members-tab>
        </div>
        <div :slot="$t('dashboard.setupProfile')">
          <setup-profile-tab></setup-profile-tab>
        </div>
        <div :slot="$t('dashboard.features')">
          <features-tab></features-tab>
        </div>
      </vuestic-tabs>
    </vuestic-widget>
-->
<!--
    <dashboard-bottom-widgets></dashboard-bottom-widgets>
-->
  </div>
</template>

<script>

  import DashboardInfoWidgets from './DashboardInfoWidgets'
  import UsersMembersTab from './users-and-members-tab/UsersMembersTab.vue'
  import SetupProfileTab from './setup-profile-tab/SetupProfileTab.vue'
  import FeaturesTab from './features-tab/FeaturesTab.vue'
  import DataVisualisationTab from './data-visualisation-tab/DataVisualisation.vue'
  import DashboardBottomWidgets from './DashboardBottomWidgets.vue'
  import moment from 'moment'
  export default {
    name: 'dashboard',
    components: {
      DataVisualisationTab,
      DashboardInfoWidgets,
      UsersMembersTab,
      SetupProfileTab,
      FeaturesTab,
      DashboardBottomWidgets
    },
    computed: {
      currentUser(){
        return this.$store.state.app.currentUser
      }
    },

    methods: {
      launchEpicmaxToast () {
        this.showToast(`Let's work together!`, {
          icon: 'fa-star-o',
          position: 'top-right',
          duration: Infinity,
          action: {
            text: 'Hire us',
            href: 'http://epicmax.co/#/contact',
            class: 'vuestic-toasted-link'
          }
        })
      },
      moment
    }
  }

</script>
<style lang="scss" scoped>
  @import "../../sass/_variables.scss";
</style>
