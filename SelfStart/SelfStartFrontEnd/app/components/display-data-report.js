import Component from '@ember/component';
import Ember from "ember";
import { inject } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
    DS: inject('store'),
    allAnswers: [],
    matchedAnswers: [],
    averageRating: 1,
    ratingGroupCount: [0,0,0,0,0,0,0,0,0,0],
    graphData: [],

  modalName: computed(function () {
    return 'displayForm' + this.get('question').id;
  }),

    options: {
        title: 'User Rating Statistics',
        height: 300,
        width: 400,

        animation: {
          startup: true,
          easing: 'inAndOut',
        },
      },

    init() {
        this._super(...arguments);
        let self = this;

        this.get('DS').findAll('answer').then((ans) => {
            self.set('allAnswers', ans.toArray());

            self.get('allAnswers').forEach(element => {

                if (element.get('question') === self.get('question').get('questionText')
                && self.get('question').get('type') === "Rating") {
                    self.get('matchedAnswers').pushObject(element);
                }
            })

            console.log(self.get('matchedAnswers'));

            var sum = 0;
            var length = 0;

            for (var i = 0; i < self.get('matchedAnswers').length; i++) {
                sum += parseInt(self.get('matchedAnswers')[i].get('answer'));
                length += 1

                if (self.get('matchedAnswers')[i].get('answer') == 1) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[0] += 1;
                    self.set(('ratingGroupCount'), temp);
                }

                else if (self.get('matchedAnswers')[i].get('answer') == 2) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[1] += 1;
                    self.set(('ratingGroupCount'), temp);
                }

                else if (self.get('matchedAnswers')[i].get('answer') == 3) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[2] += 1;
                    self.set(('ratingGroupCount'), temp);
                }

                else if (self.get('matchedAnswers')[i].get('answer') == 4) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[3] += 1;
                    self.set(('ratingGroupCount'), temp);
                }

                else if (self.get('matchedAnswers')[i].get('answer') == 5) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[4] += 1;
                    self.set(('ratingGroupCount'), temp);
                }

                else if (self.get('matchedAnswers')[i].get('answer') == 6) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[5] += 1;
                    self.set(('ratingGroupCount'), temp);
                }

                else if (self.get('matchedAnswers')[i].get('answer') == 7) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[6] += 1;
                    self.set(('ratingGroupCount'), temp);
                }

                else if (self.get('matchedAnswers')[i].get('answer') == 8) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[7] += 1;
                    self.set(('ratingGroupCount'), temp);
                }

                else if (self.get('matchedAnswers')[i].get('answer') == 9) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[8] += 1;
                    self.set(('ratingGroupCount'), temp);
                }

                else if (self.get('matchedAnswers')[i].get('answer') == 10) {
                    var temp = self.get('ratingGroupCount').toArray();
                    temp[9] += 1;
                    self.set(('ratingGroupCount'), temp);
                }
            }

            self.set('averageRating', sum / length);

            var data = [
                ['Rating', '# of Clients'],
                ['1', self.get('ratingGroupCount')[0]],
                ['2', self.get('ratingGroupCount')[1]],
                ['3', self.get('ratingGroupCount')[2]],
                ['4', self.get('ratingGroupCount')[3]],
                ['5', self.get('ratingGroupCount')[4]],
                ['6', self.get('ratingGroupCount')[5]],
                ['7', self.get('ratingGroupCount')[6]],
                ['8', self.get('ratingGroupCount')[7]],
                ['9', self.get('ratingGroupCount')[8]],
                ['10', self.get('ratingGroupCount')[9]],
              ];

            self.set('graphData', data);
        })
    },

    actions: {
        openModal: function () {
            $('.ui.' + this.get('modalName') + '.modal').modal({
                closable: false,

                transition: 'fly down',

                onDeny: () => {
                return true;

                },

                onApprove: () => {
                    window.print();
                }

            })
                .modal('show');
        },
    }
});
