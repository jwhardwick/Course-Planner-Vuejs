Vue.component('hero-banner', {

    props: ['message'],

    template: `
        <section class="hero">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">
                Course planner
              </h1>
              <h2 class="subtitle">
                Map your degree.
                {{ message }}
              </h2>
            </div>
          </div>
        </section>
        `
})




Vue.component('semesters', {



    template: `
    <div>
        <div class="field has-addons">
            <a class="button is-success is-outlined" @click="addSemester">
                <i class="fa fa-plus" aria-hidden="true"></i>
                &nbsp;
                Semester



            </a>

            <div class="control" v-show="showDropdown" >
                  <div class="select" >
                    <select v-model="nextSemester.year">
                      <option>2009</option>
                      <option>2010</option>
                      <option>2011</option>
                      <option>2012</option>
                      <option>2013</option>
                      <option>2014</option>
                      <option>2015</option>
                      <option>2016</option>
                      <option>2017</option>
                      <option>2018</option>
                      <option>2019</option>
                    </select>
                  </div>
                  <p class="help">Starting year</p>
              </div>

          </div>


          <div class="columns" v-for="count in 20">

            <div class="column is-2" v-for="semester in semesters" v-if="semester.id >= ( (count - 1) * nSemesters) && semester.id < (nSemesters + nSemesters * (count - 1) )" style="min-width:220px;min-height:220px;">

                <nav class="level-left has-addons">

                  <div class="level">
                    <div class="level-item">

                      <nav class="panel is-2">
                        <p class="panel-heading">
                          {{ semester.year }} S{{ semester.sem }}
                          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                          {{ semester.creditPoints }}
                        </p>
                        <div class="panel-block">
                          <p class="control has-icons-left has-addons">




                                <autocomplete :id="semesters[semester.id].id">
                                </autocomplete>

                            </input>



                          </p>
                        </div>
                            <div class="panel-block" v-for="subject in semester.subjects" >



                                    <a class="button is-normal is-light" @click="deleteSubject(semester.id, subject.unit_code)" style="opacity:.8;color:rgba(0, 0, 0, 0.7);">

                                        <span class="icon is-small">
                                            <i class="fa fa-times"></i>
                                        </span>
                                    </a>

                                    <a class="button is-normal is-light" style="width:125px;" @click="openSubject(semester, subject)">


                                        {{ subject.unit_code }}
                                        &nbsp; &nbsp;

                                    </a>



                          </div>
                      </nav>

                    </div>
                  </div>

                </nav>

            </div>

          </div>







    </div>
    `,

    data() {
        return {

            nextSemester: {
                id: 0,
                isSelected: false,
                field: '',
                year: 2016,
                sem: 1,
                subjects: [],
                creditPoints: 0
            },
            semesters: [],
            showDropdown: true,
            searchField: '',

            show: false,

            selected: false,

            suggestions: []
        }
    },

    methods: {
        addSemester() {
            // Get rid of year selection dropdown
            this.showDropdown = false

            // Build our semester to add
            let newSemester = {
                id: this.nextSemester.id,
                isSelected: false,
                field: '',
                year: this.nextSemester.year,
                sem: this.nextSemester.sem,
                subjects: [],
                creditPoints: 0
            }
            this.semesters.push(newSemester)

            // reset and get ready for next semester
            if (this.nextSemester.sem == 2) {
                this.nextSemester.sem = 1
                this.nextSemester.year++
            } else {
                this.nextSemester.sem++
            }

            this.nextSemester.id++
            this.nextSemester.year           = parseInt(this.nextSemester.year)
            this.nextSemester.subjects       = []
            this.nextSemester.searchField    = ''
            this.nextSemester.isSelected     = false
            this.nextSemester.creditPoints   = 0
        },

        getCourse(uosCode, id) {

            const vm = this;
            this.semesters[id].searchField = ''

            axios.post('/api/database', {
                code: uosCode
              })
              .then(function (response) {
                    if (response.data) {
                        vm.semesters[id].subjects.push(response.data)
                        vm.semesters[id].creditPoints += parseInt(response.data.credit_points)

                        Event.fire('addPoints', parseInt(response.data.credit_points))
                    }
              })
              .catch(function (error) {
                  // console.log(error);
              })
        },
        openSubject(semester, subject) {

            // console.log(subject)

            Event.fire('openSubjectPanel', subject)

        },
        getMatches() {
            // console.log(this.searchField)

            if (this.searchField.length < 3) {
                this.suggestions = []
            }

            if ( this.searchField.length >= 3) {
                axios.post('/api/auto', {field : this.searchField})
                .then(response => {
                    // // console.log(response.data)
                    let newSuggestions = []
                    this.suggestions = []
                    for (var i = 0; i < response.data.length; i++) {
                        // console.log(response.data[i])
                        newSuggestions.push(response.data[i])
                    }
                    if (newSuggestions != this.suggestions) {
                        this.suggestions = newSuggestions
                    }

                })
            }

        },
        chooseSubject(unit_code) {
            // this.isActive = false
            this.searchField = unit_code
        },
        deleteSubject(id, unit_code) {
            for (let i = 0; i < this.semesters[id].subjects.length; i++) {
                // console.log("Deleting subject: ", unit_code)
                // Iterate through subjects and remove matching unit_codes
                if (this.semesters[id].subjects[i].unit_code == unit_code) {
                    // Lower credit points
                    this.semesters[id].creditPoints -= parseInt(this.semesters[id].subjects[i].credit_points)
                    Event.fire('addPoints', parseInt(-this.semesters[id].subjects[i].credit_points))
                    // Remove subject
                    this.semesters[id].subjects.splice(i, 1)
                }
            }
        }

    },

    computed: {

        isActive: function () {
            if (this.suggestions.length > 0) {
                this.show = true
            } else {
                this.show = false
            }

            return this.show
        },
        nSemesters: function () {
            let w = window.innerWidth;
            console.log(w)
            if (w < 800) {
                return 2
            }
            else if (w < 1400) {
                return 4
            }
            else {
                return 6
            }

        }
    },

    mounted() {

        Event.listen('addSubject', (data) => this.getCourse(data.uosCode, data.id))

    }

})

window.Event = new class {

    constructor() {
        this.vue = new Vue();
    }

    fire(event, data = null) {
        this.vue.$emit(event, data);
    }

    listen(event, callback) {
        this.vue.$on(event, callback);
    }

}

Vue.component('subject-panel', {

    props: ['subject-data'],

    template: `

            <div class="modal is-active">
              <div class="modal-background" @click="closeSubjectPanel"></div>
              <div class="modal-card">

                <header class="modal-card-head">

                  <p class="modal-card-title">
                    {{ subjectData.unit_code }}:
                    {{ subjectData.unit_name }}
                  </p>

                  <button class="delete" aria-label="close" @click="closeSubjectPanel"></button>

                </header>

                <section class="modal-card-body">

                    <p v-if="subjectData.prerequisite">
                        <strong>Prerequisites: </strong>{{ subjectData.prerequisite }}
                    </p>

                    <p v-if="subjectData.assumed_knowledge">
                        <strong>Assumed knowledge: </strong>{{ subjectData.assumed_knowledge }}
                    </p>

                    <p v-if="subjectData.prohitibitions">
                        <strong>Prohibitions: </strong>{{ subjectData.prohitibitions }}
                    </p>


                  {{ subjectData.about }}

                </section>

                <footer class="modal-card-foot">
                  <a class="button is-success" :href="subjectData.link" target="_blank">Read more</a>
                </footer>
              </div>
            </div>

    `,

    methods: {
        closeSubjectPanel() {
            Event.fire('closePanel')
        }
    }

})

Vue.component('autocomplete', {

    // Will be difficult to integrate into current spaghetti code
    // Next step should be refactoring semesters into something less insane


    // Only want it to show options if text box is selected
    // this is a non trivial problem

    props: ['id'],

    data() {
        return {
            searchField: '',

            show: false,

            focus: false,

            suggestions: [],

            activeSuggestionIndex: 0
        }
    },

    template: `
        <div class="dropdown" :class="{ 'is-active': isActive }">
            <input class="input is-small" type="text" placeholder="Enter subject..." v-on:keyup="getMatches()" v-model="searchField" @focus="onFocus()" @blur="onBlur()" @keydown.up="upActiveSuggestion()" @keydown.down="downActiveSuggestion()" @keydown.enter="enterSubject()"">




              <div class="dropdown-trigger">

              </div>
              <div class="dropdown-menu" id="dropdown-menu4" role="menu">
                <div class="dropdown-content">
                  <a href="#" class="dropdown-item" v-for="suggestion in this.suggestions" @mousedown="chooseSubject(suggestion.unit_code)" :class="{ 'is-active': activeSuggestion(suggestion) }" >

                        <b>{{ suggestion.unit_code }}</b><br>
                        {{ suggestion.unit_name }}

                  </a>
                </div>
              </div>


        </div>
        `,

    methods: {
        getMatches() {
            // console.log(this.searchField)

            if (this.searchField.length < 3) {
                this.suggestions = []
            }

            if ( this.searchField.length >= 3) {
                axios.post('/api/auto', {field : this.searchField})
                .then(response => {
                    // // console.log(response.data)
                    let newSuggestions = []
                    this.suggestions = []
                    for (var i = 0; i < response.data.length; i++) {

                        response.data[i].index = i
                        // console.log(response.data[i])
                        newSuggestions.push(response.data[i])
                    }
                    if (newSuggestions != this.suggestions) {
                        this.suggestions = newSuggestions
                    }

                })
            }

        },

        chooseSubject(unit_code) {
            data = {
                uosCode: unit_code,
                id: this.id
            }

            Event.fire('addSubjectParent', data)

            // // console.log(this.id)

            this.searchField = ''
            this.suggestions = []
            this.activeSuggestionIndex = 0

        },

        onFocus() {
            this.focus = true
        },

        onBlur() {
            this.searchField = ''
            this.suggestions = []
            this.activeSuggestionIndex = 0
            // this.focus = false
        },

        upActiveSuggestion() {
            // console.log("upSuggestionIndex")
            if (this.activeSuggestionIndex > 0) {
                this.activeSuggestionIndex--
            }

        },

        downActiveSuggestion() {
            if (this.activeSuggestionIndex < this.suggestions.length - 1) {
                this.activeSuggestionIndex++
            }

        },

        activeSuggestion(suggestion) {

            if (this.activeSuggestionIndex == suggestion.index) {
                return true
            }
            return false

        },

        enterSubject() {
            // console.log(this.suggestions[this.activeSuggestionIndex].unit_code)

            try {
                let uosCode = this.suggestions[this.activeSuggestionIndex].unit_code
                data = {
                    uosCode: uosCode,
                    id: this.id
                }

                Event.fire('addSubjectParent', data)

                // // console.log(this.id)

                this.searchField = ''
                this.suggestions = []
                this.activeSuggestionIndex = 0
            }
            catch (err) {
                // Subject not valid
                return
            }


        }
    },

    computed: {

        isActive: function () {
            if (this.suggestions.length > 0 && this.focus) {
                this.show = true
            } else {
                this.show = false
            }

            return this.show
        }
    }
})

Vue.component('vue-logo', {
    template: `
              <p>
                <?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <svg
                   xmlns:dc="http://purl.org/dc/elements/1.1/"
                   xmlns:cc="http://creativecommons.org/ns#"
                   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                   xmlns:svg="http://www.w3.org/2000/svg"
                   xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 400 400"
                   height="50"
                   width="50"
                   xml:space="preserve"
                   id="svg2"
                   version="1.1"><metadata
                     id="metadata8"><rdf:RDF><cc:Work
                         rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type
                           rdf:resource="http://purl.org/dc/dcmitype/StillImage" /></cc:Work></rdf:RDF></metadata><defs
                     id="defs6" /><g
                     transform="matrix(1.3333333,0,0,-1.3333333,0,400)"
                     id="g10"><g
                       transform="translate(178.0626,235.0086)"
                       id="g12"><path
                         id="path14"
                         style="fill:#4dba87;fill-opacity:1;fill-rule:nonzero;stroke:none"
                         d="M 0,0 -22.669,-39.264 -45.338,0 h -75.491 L -22.669,-170.017 75.491,0 Z" /></g><g
                       transform="translate(178.0626,235.0086)"
                       id="g16"><path
                         id="path18"
                         style="fill:#435466;fill-opacity:1;fill-rule:nonzero;stroke:none"
                         d="M 0,0 -22.669,-39.264 -45.338,0 H -81.565 L -22.669,-102.01 36.227,0 Z" /></g></g></svg>
              </p>


    `
})

Vue.component('app-footer', {

    template: `

        <footer class="footer">
          <div class="container">
            <div class="content has-text-centered">
              <p>
                Created by <a href="https://github.com/jwhardwick">James Hardwick</a>. The source code is licensed
                <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
              </p>
              <vue-logo></vue-logo>



            </div>
          </div>
        </footer>

    `,
})

Vue.component('fluid-cont', {

    template: `
        <div class="container is-fluid">

        </div>
    `,
})

Vue.component('delete-subject', {

    template: `
        <div class="container is-fluid">

        </div>
    `,
})

new Vue({

    el: '#root',


    data() {
        return {

            totalCreditPoints: 0,
            isSubjectPanelActive: false,
            activeSubject: {}
        }
    },

    mounted() {

        // axios.get('/axios').then(response => // console.log(response))

        // axios.post('/api/database', {
        //     code: 'COMP2129'
        //   })
        //   .then(function (response) {
            // // console.log(response);
        //   })
        //   .catch(function (error) {
            // // console.log(error);
        //   })

    },

    created() {
        Event.listen('addPoints', (data) => this.totalCreditPoints += data)

        Event.listen('openSubjectPanel', (data) => {

            this.activeSubject = data
            this.isSubjectPanelActive = true
            // console.log(data.unit_code)

        }),

        Event.listen('closePanel', () => this.isSubjectPanelActive = false)

        Event.listen('testParent', () => Event.fire('testEvent'))


        Event.listen('addSubjectParent', (data) => Event.fire('addSubject', data))

    }

})
