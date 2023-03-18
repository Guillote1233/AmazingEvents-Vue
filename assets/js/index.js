const { createApp } = Vue
const dataUrl = "../assets/js/amazing.json"

createApp({
    data(){
        return{
            events : undefined,
            categories: undefined,
            filteredCards: [],
            searchValue: '',
            isChecked: [],
            loading: true
        }
    },
    created(){
        fetch(dataUrl)
            .then(resp => resp.json())
            .then(data => {
                this.events = data.events;
                this.filteredCards = this.events
                const cat = events => events.category
                this.categories = [...new Set(this.events.map(cat))]
                this.loading = false
            })
            .catch(err => console.log(err))
    },
    methods:{
        filterCat(){
            this.filteredCards = this.events.filter(event =>
                (this.isChecked.includes(event.category) || this.isChecked.length ===0) && event.name.toLowerCase().includes(this.searchValue.toLowerCase()))
        }
    },
    computed:{

    }
}).mount("#app")