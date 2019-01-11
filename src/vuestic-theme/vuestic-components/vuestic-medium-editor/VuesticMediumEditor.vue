<template>
  <div class="vuestic-medium-editor">
    <slot></slot>
  </div>
</template>

<script>
  import MediumEditor from 'medium-editor'
  import Autolist from 'medium-editor-autolist'
  import Spreadsheet from 'medium-editor-handsontable'

  var UploadButton = MediumEditor.Extension.extend({
    name: 'uploader',
    init: function(){
      this.button = this.document.createElement('button');
      this.button.classList.add('medium-editor-action');
      this.button.innerHTML = '<i class="fa fa-image"></i>';
      this.button.title = 'Image Upload';
      this.on(this.button, 'click', this.handleClick.bind(this));
    },
    getButton: function(){
      return this.button;
    },
    handleClick: function(event){
      let fileUploader = document.getElementById('fileUploadDialog');
      fileUploader.click();
      fileUploader.onchange = function() {
        const url = process.env.API;
        const files = fileUploader.files;
        const formData = new FormData();
        formData.append('files[]', files[0]);
        if (window.getSelection) {
          var sel = window.getSelection();
          if (sel.getRangeAt && sel.rangeCount) {
            var range = sel.getRangeAt(0);
            fetch(
              `${url}/upload`,
              {
                method: 'POST',
                body: formData,
                headers: new Headers({
                  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                })
              }
            ).then(response => response.json())
              .then(responseData => {
                console.log(responseData[0]);
                var newImage = new Image(100, 100);
                newImage.src = responseData[0].path;
                newImage.addEventListener('click', event => {
                  alert('Provide options to customize image.')
                });
                range.insertNode(newImage);
                fileUploader.files = null;
              })
          }
        }
      }
      /*
       * When uploader content changes, post to server
       * Display loading mask
       * When upload is done, get the object url
       * Put url at caret position as src attribute to image object
      */
    }
  })

  export default {
    name: 'vuestic-medium-editor',

    props: {
      editorOptions: {
        type: Object,
        default: () => {
          return {
            autoLink: true,
            buttonLabels: 'fontawesome',
            disableEditing: true,
            extensions: {
              autolist: new Autolist(),
              uploader: new UploadButton(),
              spreadsheet: new Spreadsheet({
                manualColumnResize: true,
                manualRowResize: true,
              })
            },
            spellcheck: true,
            targetBlank: true,
            toolbar: {
              buttons: [
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                'h1',
                'h2',
                'h3',
                'justifyLeft',
                'justifyCenter',
                'justifyRight',
                'outdent',
                'indent',
                'orderedlist',
                'unorderedlist',
                'spreadsheet',
                'uploader'
              ],
              static: true,
              sticky: true,
              updateOnEmptySelection: true
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
      padding: 20px 20px;
      outline: 1px solid rgba(0,0,0,.06);
    }
  }
</style>
