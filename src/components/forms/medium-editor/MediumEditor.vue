<template>
  <div class="medium-editor">
    <div class="row">
      <div class="col-md-12">
        <vuestic-widget :headerText="'forms.mediumEditor.title' | translate">
          <vuestic-medium-editor @initialized="handleEditorInitialization" :editor-options="editorOptions">
            <h1>The Old Man and the Sea</h1>

            <p>
              <i>'Thank you,' the old man said. He was too simple to wonder when he had attained humility. But he knew he had attained it and he knew it was not disgraceful and it carried no loss of true pride.</i>
            </p>

            <p>
              Picture it. Walk with me for a second.
            </p>


            <p>
              He always thought of the sea as la mar which is what people call her in Spanish when they love her. Sometimes those who love her say bad things of her but they are always said as though she were a woman. Some of the younger fishermen, those who used buoys as floats for their lines and had motorboats, bought when the shark livers had brought much money, spoke of her as el mar which is masculine. The spoke of her as a contestant or a place or even an enemy. But the old man always thought of her as feminine and as something that gave or withheld great favours, and if she did wild or wicked things it was because she could not help them. The moon affects her as it does a woman, he thought.
            </p>
            <p>
              He had no mysticism about turtles although he had gone in turtle boats for many years. He was sorry for them all, even the great trunk backs that were as long as the skiff and weighed a ton. Most people are heartless about turtles because a turtle's heart will beat for hours after he has been cut up and butchered. But the old man thought, I have such a heart too and my feat and hands are like theirs.
            </p>

            <p>
              When once, through my treachery, it had been necessary to [the marlin] to make a choice, the old man thought. His choice had been to stay in the deep dark water far out beyond all snares and traps and treacheries. My choice was to go there to find him beyond all people. Beyond all people in the world. Now we are joined together and have been since noon. And no one to help either one of us.
            </p>

            <p>
              ...he thought much and he kept on thinking about sin. You did not kill the fish only to keep alive and to sell for food, he thought. You killed him for pride and because you are a fisherman. You loved him when he was alive and you loved him after. If you love hi, it is not a sin to kill him. Or is it more?
              'You think too much, old man,' he said aloud.
              But you enjoyed killing the dentuso [a shark who had attacked the dead marlin strapped to the boat], he thought. He lives on the live fish as you do. He is not a scavenger nor just a moving appetite as some sharks are. He is beautiful and noble and knows no fear of anything.
              'I killed him in self-defense,' the old man said aloud. 'And I killed him well.'
              Besides, he thought, everything kills everything else in some way. Fishing kills me exactly as it keeps me alive. The boy keeps me alive, he thought. I must not deceive myself too much.
            </p>

            <p>
              Read full article on <a href="https://medium.com/@dorn.anna/girl-no-you-dont-2e21e826c62c">Medium</a>
            </p>
          </vuestic-medium-editor>
        </vuestic-widget>
      </div>
    </div>
  </div>
</template>

<script>
  import Spreadsheet from 'medium-editor-handsontable'
  import Autolist from 'medium-editor-autolist'

  export default {
    name: 'medium-editor',

    data () {
      return {
        editor: {},
        editorOptions: {
          autoLink: true,
          buttonLabels: 'fontawesome',
          disableEditing: false,
          spellcheck: true,
          extensions: {
            spreadsheet: new Spreadsheet(),
            autolist: new Autolist()
          },
          toolbar: {
            static: true,
            sticky: true,
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
              'quote',
              'justifyLeft',
              'justifyCenter',
              'justifyRight',
              'justifyFull',
              'outdent',
              'indent',
              // 'image',
              'orderedlist',
              'unorderedlist',
              'spreadsheet'
            ],
          }
        }
      }
    },

    methods: {
      handleEditorInitialization (editor) {
        this.editor = editor
        this.$nextTick(() => {
          // this.highlightSampleText()
        })
      },

      highlightSampleText () {
        let sampleText = document.getElementsByClassName('default-selection')[0]
        this.editor.selectElement(sampleText)
      }
    },
    watch: {

    }
  }
</script>

<style lang="scss">
// @import '';
// @import '/static/stylesheets/medium-editor-tables.min.css';

</style>
