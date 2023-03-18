const { createApp } = Vue
const dataUrl = "../assets/js/amazing.json"

createApp({
    data(){
        return{
            eventDetail: undefined,
            loading: true

        }
    },
    created(){
        fetch(dataUrl)
            .then(resp => resp.json())
            .then(data => {
                let locationVar = location.search
                let params = new URLSearchParams(locationVar)
                let id = params.get('id')
                this.eventDetail = data.events.find(eventDetail => eventDetail._id == id)
                this.loading = false
            })
            .catch(err => console.log(err))
    }
}).mount("#app")



