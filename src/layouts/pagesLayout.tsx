import Sidebar from '../components/sidebar'
import CustomNavbar from '../components/navbar'

interface LayoutProps {
    title: string;
    page: React.ReactNode;
}

function PagesLayout({ title, page }: LayoutProps) {

    return (
        <div className='row h-100 m-0'>
            <div className="col-md-2 d-md-block d-none p-0">
                <Sidebar />
            </div>
            <div className="col-md-10 col-12 p-4">
                <CustomNavbar title={title} />
                {page}   {/* this is to show/render the actual page passed*/}
            </div>
        </div>
    )
}

export default PagesLayout; 