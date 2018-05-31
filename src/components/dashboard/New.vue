<template>
  <div class="dashboard">
    <vuestic-widget>
      <h2 style="padding-top:50px">{{'new.title' | translate}}</h2>
      <hr>
      <div class="row" style="padding:auto 50px; padding-bottom:100px;">
        <form class="offset-md-2 col-md-8" v-model="project">
            <div class="row">
              <div class="col">
                <div class="form-group">
                  <fieldset>
                    <div class="input-group">
                      <vuestic-date-picker
                        id="date-picker-basic"
                        v-model="project.startDate"
                      />
                      <label class="control-label" for="date-picker-basic">
                        {{ $t('new.start_date') }}
                      </label>
                      <i class="bar"></i>
                    </div>
                  </fieldset>
                </div>
              </div>
          <div class="col">
            <div class="form-group">
              <fieldset>
                <vuestic-switch v-model="project.isPublic">
                  <span slot="trueTitle">{{'new.public' | translate}}</span>
                  <span slot="falseTitle">{{'new.private' | translate}}</span>
                </vuestic-switch>
              <small v-if="project.isPublic">{{'new.public_desc' | translate}}</small>
              <small v-else>{{'new.private_desc' | translate}}</small>
              </fieldset>
            </div>
          </div>
          </div>

          <div class="form-group">
            <div class="input-group">
              <input id="simple-input" required v-model="project.title"/>
              <label class="control-label" for="simple-input">{{'new.project_title'
                | translate}}</label><i class="bar"></i>
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
              <textarea type="text" id="simple-textarea"
                                required v-model="project.description"></textarea>
              <label class="control-label" for="simple-textarea">{{'new.description'
                        | translate}}</label><i class="bar"></i>
            </div>
          </div>
          <div class="form-group">
            <div class="input-group">
              <button class="btn btn-danger" type="button" @click="createProject()">{{'new.create' | translate}}</button>
            </div>
          </div>
        </form>
      </div>

    </vuestic-widget>
  </div>
</template>

<script>
  export default{
    name: 'new-project',
    data(){
      return {
        project: {
          isPublic: true,
          title: '',
          description: '',
          startDate: new Date().toISOString(),

        }
      }
    },
    methods: {
      createProject(){
        this.$http.post('/projects/new', this.project).then(res => {
        // this.$message(`Successfully created ${res.body.title}`);
          this.$router.push(`/projects/${res.data.permalink}`);
        });
      }
    }

  }
</script>
