


const app = Vue.createApp({

    setup(){

        const data = {
            id: '',
            author : '',
            quote: {
                en: '',
                fr:''
            },
            category: '',
            tags: [],
            image_url : '',
            author_url:'',
            author_info : {
                bio: {
                    en: '',
                    fr: ''
                }
            },
            wiki_url : ''
        
        }
        const author = Vue.ref('');
        const quote_en = Vue.ref('');
        const quote_fr = Vue.ref('');
        const category = Vue.ref('');
        const tags = Vue.ref([]);
        const image_url = Vue.ref('');
        const author_url = Vue.ref('');
        const bio_en = Vue.ref('');
        const bio_fr = Vue.ref('');
        const wiki_url = Vue.ref('');

        const addTags = (e) => {
            const tag = e.target.value

            if (tags.value.includes(tag)) {
                return
            }else {
                tags.value.push(tag)
                data['tags'].push(tag)
                e.target.value = ''
            }
           
        }

        const submitNewQuote = () => {
           //Save to data object
           data['author'] = author.value
           data['quote']['en'] = quote_en.value
           data['quote']['fr'] = quote_fr.value
           data['category'] = category.value
           data['image_url'] = image_url.value
           data['author_url'] = author_url.value
           data['author_info']['bio']['en'] = bio_en.value
           data['author_info']['bio']['fr'] = bio_fr.value
           data['wiki_url'] = wiki_url.value

           fetch('http://localhost:4000/new_quote', {
            method: 'POST',
            
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
           })
           .then((res) => {
            console.log(res)
           }).catch(err => console.error(err))
        
           //Reset form
           author.value = ''
        }


     
        return {
            data ,
            author,
            quote_en,
            quote_fr,
            category,
            tags,
            image_url,
            author_url,
            bio_en,
            bio_fr,
            wiki_url,
            submitNewQuote,
            addTags

        }
    }
    

});

app.mount('#app')


