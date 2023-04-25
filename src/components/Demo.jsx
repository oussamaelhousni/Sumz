import {useState,useEffect} from 'react'
import {copy,linkIcon,loader,tick} from '../assets'
import { useLazyGetSummaryQuery } from '../services/article'
const Demo = () => {
    const [article,setArticle] = useState({
        url:"",
        summary:""
    })

    const [copied,setCopied] = useState(null)
    const [allArticles,setAllArticles] = useState([])

    const [getSummary,{error,isFetching}] = useLazyGetSummaryQuery()

    useEffect(()=>{
        const allArticlesSaved = JSON.parse(localStorage.getItem("articles"))
        if(allArticlesSaved){
            setAllArticles(allArticlesSaved)
        }
    },[])

    const handleCopy = (copyUrl)=>{
        setCopied(copyUrl)
        navigator.clipboard.writeText(copyUrl)
        setTimeout(()=>{
            setCopied(null)
        },3000)
    }
    const handleSubmit = async(e)=>{
        e.preventDefault()
        const {data} = await getSummary({
            articleUrl:article.url
        })

        if(data?.summary){
            const newArticle = {...article,summary:data.summary}
            const allArticlesUpdated = [...allArticles,newArticle]
            setArticle(newArticle)
            setAllArticles(allArticlesUpdated)
            localStorage.setItem("articles",JSON.stringify(allArticlesUpdated))
        }
    }
  return (
    <section className='mt-16 w-full max-w-xl'>
        {/* Search */}
        <div className="flex flex-col w-full gap-2">
            <form className="relative flex justify-center items-center" onSubmit={handleSubmit}>
                <img src={linkIcon} alt="link_icon" className='absolute left-0 my-2 ml-3 w-5'/>
                <input type="url" placeholder='Enter a URL' className='url_input peer' value={article.url} onChange={(e)=>{
                    setArticle({...article,url:e.target.value})
                }}/>
                <button type="submit" className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'>↩</button>
            </form>
            {/* Browse URL History */}
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                {
                    allArticles.map((item,index)=>{
                        return (
                            <div key={"link-"+index} className='link_card' onClick={()=>setArticle(item)}>
                                <div className="copy_btn">
                                    <img src={copied===item.url ? tick : copy} alt="copy_icon" className='w-[40%] h-[40%] object-contain' onClick={()=>handleCopy(item.url)} />
                                </div>
                                <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate
                                '>
                                    {item.url}
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        {/* Summary */}
        <div className="my-10 max-w-full flex justify-center">
                {
                    isFetching?
                        <div className='flex justify-center items-center'>
                            <img src={loader} alt="loader" className='w-20 h-20 object-contain' />
                        </div>
                        : error ?
                            <p className="font-inter font-bold text-black">
                                Well, that wasn't supposed to happen ....<br />
                                <span className="font-satoshi font-normal text-gray-700">
                                    {
                                        error?.data?.error
                                    }
                                </span>
                            </p>:article.summary && (
                                <div className="flex flex-col gap-3">
                                    <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                                        Article <span className='blue_gradient'>Summary</span>
                                    </h2>
                                    <div className="summary_box">
                                        <p>
                                            {article.summary}
                                        </p>
                                    </div>
                                </div>
                            )

                        
                }
        </div>
    </section>
  )
}

export default Demo