export default function handler(req,res){
    if(req.method == 'GET'){
        try {

            const {url}=req.body
            console.log(url)
            const response = await fetch(url);
            res.status(200).json({ response })



          } catch (err) {
            res.status(500).json({ error: 'failed to fetch data' })
          }
    }
}