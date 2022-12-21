import React, { memo } from 'react';
import api from '../../core/api';
import { isEmpty } from '../../utils';

//react functional component
const UserTopSeller = ({ user }) => {
    return (
        <div className="author_item">
            <div className="author_list_pp">
              <span onClick={()=> window.open("", "_self")}>
                  <img className="lazy" src={isEmpty(user.avatarUri) ? 'img/avatar.png' : api.ipfsUrl + user.avatarUri} alt=""/>
              </span>
            </div>                                    
            <div className="author_list_info">
                <span onClick={()=> window.open("", "_self")}>{user.promoter && (user.promoter.slice(0, 6) + "..." + user.promoter.slice(38))}</span>
                <span className="bot">{user.amount} G$</span>
            </div>   
        </div>     
    );
};

export default memo(UserTopSeller);