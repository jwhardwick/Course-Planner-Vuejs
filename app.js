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
                    <select v-model="newSemester.year">
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


          <div class="columns">

            <div class="column is-2" v-for="semester in semesters">

                <nav class="level-left has-addons" >

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

                            <input class="input is-small" type="text" placeholder="Subject code..." v-on:keyup.enter="getCourse(semester.searchField, semester.year, semester.sem)" v-model="semester.searchField">



                          </p>
                        </div>


                        <a class="panel-block" v-for="subject in semester.subjects" @click="openSubject(semester, subject)">
                          <span class="panel-icon">
                            {{ subject.credit_points }}
                          </span>
                          {{ subject.unit_code }}


                          </a>
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
            newSemester: {
                isSelected: false,
                field: '',
                year: 2016,
                sem: '',
                subjects: [],
                creditPoints: 0
            },
            semesters: [],
            showDropdown: true
        }
    },

    methods: {
        addSemester() {
            console.log("Add Semester")
            console.log(this.newSemester)

            if (this.showDropdown) {
                // First time adding a semester
                // Send event to another component where they can add year?

                this.newSemester.sem = 1

                this.showDropdown = false

                this.semesters.push(this.newSemester)

                let oldYear = parseInt(this.newSemester.year)

                this.newSemester = { year: oldYear, sem: 2, subjects: [], searchField: '', isSelected: false, creditPoints: 0 }
            }
            else if (this.newSemester.sem == 2) {
                // No problem
                this.semesters.push(this.newSemester)

                let oldYear = this.newSemester.year

                this.newSemester = { year: oldYear + 1, sem: 1, subjects: [], searchField: '', isSelected: false, creditPoints: 0  }
            }
            else {
                //
                this.semesters.push(this.newSemester)

                let oldYear = this.newSemester.year

                this.newSemester = { year: oldYear, sem: 2, subjects: [], searchField: '', isSelected: false, creditPoints: 0  }
            }
        },

        getCourse(uosCode, year, sem) {

            console.log("getCourse(uosCode, year, sem): " + uosCode + ", " + year + ", " + sem)

            console.log("this.semester: " + this.newSemester)
            const vm = this;

            for (let i = 0; i < vm.semesters.length; i++) {
                if (vm.semesters[i].year == year && vm.semesters[i].sem == sem) {
                    console.log("Match found at: " + i)
                    console.log("vm.semesters[i]: " + vm.semesters[i] )
                    vm.semesters[i].searchField = ''
                }
            }


            axios.post('/api/database', {
                code: uosCode
              })
              .then(function (response) {

                    console.log("reponse.data")
                    console.log(response.data);

                    if (response.data) {
                        for (let i = 0; i < vm.semesters.length; i++) {
                            if (vm.semesters[i].year == year && vm.semesters[i].sem == sem) {
                                console.log("Match found at: " + i)
                                console.log("vm.semesters[i]: " + vm.semesters[i] )
                                vm.semesters[i].subjects.push(response.data)
                                vm.semesters[i].creditPoints += parseInt(response.data.credit_points)

                                Event.fire('addPoints', parseInt(response.data.credit_points))
                            }
                        }
                    }


              })
              .catch(function (error) {
                  console.log(error);
              })

        },

        openSubject(semester, subject) {

            console.log(subject)

            Event.fire('openSubjectPanel', subject)
        }
    }

})

// Vue.component('semester', {
//
//     props: {
//         year: { required: true },
//         semester: { require: false }
//     },
//
//     template: `
//         <div><slot></slot></div>
//     `
// });



// import axios from 'axios';

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
              <div class="modal-background"></div>
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

                    <p v-if="subjectData.prohitibitions">
                        <strong>Prohibitions: </strong>{{ subjectData.prohitibitions }}
                    </p>

                    <a v-if="subjectData.link" :href="subjectData.link">
                        <strong>Read more</strong>
                    </a>

                  {{ subjectData.about }}

                </section>

                <footer class="modal-card-foot">
                  <button class="button is-success">Save changes</button>
                  <button class="button" @click="closeSubjectPanel">Cancel</button>
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

        // axios.get('/axios').then(response => console.log(response))

        // axios.post('/api/database', {
        //     code: 'COMP2129'
        //   })
        //   .then(function (response) {
        //     console.log(response);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   })

    },

    created() {
        Event.listen('addPoints', (data) => this.totalCreditPoints += data)

        Event.listen('openSubjectPanel', (data) => {

            this.activeSubject = data
            this.isSubjectPanelActive = true
            console.log(data.unit_code)

        }),

        Event.listen('closePanel', () => this.isSubjectPanelActive = false)
    }

})
