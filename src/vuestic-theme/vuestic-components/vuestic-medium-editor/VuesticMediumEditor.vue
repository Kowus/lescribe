<template>
  <div class="vuestic-medium-editor">
    <slot></slot>
  </div>
</template>

<script>
  import MediumEditor from 'medium-editor'

  export default {
    name: 'vuestic-medium-editor',

    props: {
      editorOptions: {
        type: Object,
        default: () => {
          return {
            buttonLabels: 'fontawesome',
            autoLink: true,
            toolbar: {
              buttons: [
                'bold',
                'italic',
                'underline',
                'anchor',
                'h1',
                'h2',
                'h3'
              ]
            }
          }
        }
      }
    },

    data () {
      return {
        editor: null
      }
    },

    mounted () {
      this.initEditor()
    },

    beforeDestroy () {
      this.destroyEditor()
    },

    methods: {
      initEditor () {
        this.editor = new MediumEditor(this.$el, this.editorOptions)
        this.$emit('initialized', this.editor)
      },

      destroyEditor () {
        this.editor.destroy()
      }
    }
  }
</script>

<style lang="scss">
  .vuestic-medium-editor {
    padding: 5px 20px;
    &:focus {
      outline: 1px solid rgba(0,0,0,.1);
    }
  }
</style>
