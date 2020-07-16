import React from 'react'
import { GrFacebook,GrInstagram ,GrYoutube} from 'react-icons/gr';
import { FaCcPaypal,FaCcVisa,FaCcMastercard} from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footerOne">
                <div><h1>PANDORA</h1></div>
                <div className="footerNavigator">
                    <div>Strona główna</div>
                    <div>Kontakt</div>
                    <div>Regulamin</div>
                </div>
                <div className="footerSocialMedia">
                    <div><GrFacebook size="3rem"/></div>
                    <div><GrInstagram size="3rem"/></div>
                    <div><GrYoutube size="3rem"/></div>
                </div>
            </div>
            <div className="footerTwo">
                <div><h5>Copyright@PANDORA 2020</h5></div>
                <div><FaCcPaypal size="3rem"/></div>
                <div><FaCcVisa size="3rem"/></div>
                <div><FaCcMastercard size="3rem"/></div>  
            </div>
        </footer>
    )
}

export default Footer;