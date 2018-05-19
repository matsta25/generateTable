var storageKey = 'developerAssignment';

var tableStorage = {
    fetch: function () {
        var dataStorage = JSON.parse(localStorage.getItem(storageKey) || '[]');
        return dataStorage;
    },
    save: function (dataStorage) {
        localStorage.setItem(storageKey, JSON.stringify(dataStorage));
    },
    del: function () {
        localStorage.removeItem(storageKey);
    },
}

var vm = new Vue({
    el: '#app',
    data: {
        tableData: tableStorage.fetch(),
        tableHeader: [
            "Name",
            "Surname",
            "Birthdate",
            "Pesel",
            "Done"
        ],
        inputValOne: '',
        inputValTwo: '',
        inputValThree: '',
        inputValFour: '',
        inputValFive: false,
        footerLenght: 5,
        selected: 5,
        options: [
            { value: 5 },
            { value: 10 },
            { value: 15 }
        ],
        tableHeaderLenght: 10,
        currentPage: 1,
        startRow: 0,
        endRow: 5,
        dataTableLenght: 0,
        currentSort: "header1",
        currentSortDir: 'asc',
        nameLenght: 5,
        surnameLenght: 7,
        generateDataLenght: 200,
        search: ''

    },
    created: function () {
        this.dataTableLenght = this.tableData.length;
    },
    methods: {
        setStorage: function () {
            localStorage.setItem('tableData', this.tableData);
        },
        addData: function (e) {
            e.preventDefault();
            if (this.inputValOne) {
                this.tableData.push({
                    one: this.inputValOne,
                    two: this.inputValTwo,
                    three: this.inputValThree,
                    four: this.inputValFour,
                    five: this.inputValFive
                });
            }
            this.inputValOne = '';
            this.inputValTwo = '';
            this.inputValThree = '';
            this.inputValFour = '';
            this.inputValFive = false;
        },
        toggleCheckbox: function (data, index) {
            this.tableData[index].five = !this.tableData[index].five;
            tableStorage.del();
            tableStorage.save(this.tableData);
        },

        numPages: function () {
            return Math.ceil(this.tableData.length / this.selected);
        },

        prevPage: function () {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.startRow = this.startRow - this.selected;
                this.endRow = this.currentPage * this.selected;
            }
        },
        nextPage: function () {
            if (this.currentPage < this.numPages()) {
                this.currentPage++;
                this.startRow = this.startRow + this.selected;
                this.endRow = this.currentPage * this.selected;
                if (this.endRow > this.dataTableLenght) {
                    this.endRow = this.tableData.length;

                }
            }
        },
        selectedUpdate: function () {
            this.startRow = 0;
            this.endRow = this.currentPage * this.selected;
        },
        sort: function (s) {
            if (s === this.currentSort) {
                this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
            }
            this.currentSort = s;
            console.log(s);
        },
        generateData: function () {
            var chars = "abcdefghijklmnoprstuwz";

            for (var j = 0; j < this.generateDataLenght; j++) {
                var randomName = '';
                for (var i = 0; i < this.nameLenght; i++) {
                    var randomNum = Math.floor(Math.random() * chars.length);
                    randomName += chars.substring(randomNum, randomNum + 1);
                    if (i == 0) {
                        randomName = randomName.toUpperCase();
                    }
                }

                var randomSurname = '';
                for (var i = 0; i < this.surnameLenght; i++) {
                    var randomNum = Math.floor(Math.random() * chars.length);
                    randomSurname += chars.substring(randomNum, randomNum + 1);
                    if (i == 0) {
                        randomSurname = randomSurname.toUpperCase();
                    }
                }

                var randomBirthdate = '';

                var randomMonth = Math.floor(Math.random() * 12) + 1;
                if (randomMonth < 10) {
                    randomMonth = '0' + randomMonth;
                }
                randomBirthdate += randomMonth;
                randomBirthdate += '/';

                var randomDay = Math.floor(Math.random() * 30) + 1;
                if (randomDay < 10) {
                    randomDay = '0' + randomDay;
                }
                randomBirthdate += randomDay;
                randomBirthdate += '/';

                var randomYear = Math.floor(Math.random() * 70) + 1930;
                randomBirthdate += randomYear;

                var pesel = '';
                pesel += randomYear.toString().substr(2, 2) + randomMonth + randomDay;

                var randomPeselEnding = '';
                for (var i = 0; i < 5; i++) {
                    randomPeselEnding += Math.floor(Math.random() * 9);
                }

                pesel += randomPeselEnding;

                var done = Math.random() >= 0.5;

                // console.log(randomName + ' ' + randomSurname + ' ' + randomBirthdate + ' ' + pesel + ' '+ done);

                var peselUnikat = true;

                for (var x = 0; x < j - 1; x++) {
                    if (pesel == this.tableData[x].four) {
                        peselUnikat = false;
                        console.log(pesel + '==' + this.tableData[x].four);
                    } else {
                        console.log('unikat');
                    }
                }

                if (peselUnikat) {
                    this.tableData.push({
                        one: randomName,
                        two: randomSurname,
                        three: randomBirthdate,
                        four: pesel,
                        five: done
                    });
                } else {
                    j--;
                }


            }
             location.reload();
            console.log('ref');

        },
        preInputValFour: function () {
            var prePeselFormated = '';
            prePeselFormated += this.inputValThree.substr(2,2);
            prePeselFormated += this.inputValThree.substr(5,2);
            prePeselFormated += this.inputValThree.substr(8,2);
            this.inputValFour = prePeselFormated;
        }
    },
    computed: {
        sortedTable: function () {
            return this.tableData.sort((a, b) => {
                var x, y;
                if (this.currentSort == this.tableHeader[0]) {
                    x = a.one;
                    y = b.one
                } else if (this.currentSort == this.tableHeader[1]) {
                    x = a.two;
                    y = b.two;
                } else if (this.currentSort == this.tableHeader[2]) {
                    x = a.four.substr(0, 6);
                    y = b.four.substr(0, 6);
                } else if (this.currentSort == this.tableHeader[3]) {
                    x = a.four;
                    y = b.four;
                } if (this.currentSort == this.tableHeader[4]) {
                    x = a.five;
                    y = b.five;
                }
                var modifier = 1;
                if (this.currentSortDir === 'desc') {
                    modifier = -1;
                }
                if (x < y) {
                    return -1 * modifier;
                }
                if (x > y) {
                    return 1 * modifier;
                }
                return 0;
            });
        }
        , filteredList() {
            return this.tableData.filter(row => {
                if (row.one.toLowerCase().includes(this.search.toLowerCase())) {
                    return row.one.toLowerCase().includes(this.search.toLowerCase())
                }
                if (row.two.toLowerCase().includes(this.search.toLowerCase())) {
                    return row.two.toLowerCase().includes(this.search.toLowerCase())
                }
                if (row.three.toLowerCase().includes(this.search.toLowerCase())) {
                    return row.three.toLowerCase().includes(this.search.toLowerCase())
                }
                if (row.four.toLowerCase().includes(this.search.toLowerCase())) {
                    return row.four.toLowerCase().includes(this.search.toLowerCase())
                }
            })
        }
    },
    watch: {
        tableData: {
            handler: function (tableData) {
                tableStorage.save(tableData);
            }
        }
    }
});
