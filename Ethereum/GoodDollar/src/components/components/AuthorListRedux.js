import React, { memo, useState, useEffect } from "react";
import UserTopSeller from './UserTopSeller';
import { fetchTopPromoters } from "../../store/actions/thunks";
const AuthorList = () => {
    const [promoters, setPromoters] = useState([]);
    useEffect(() => {
        const loadTopPromoters = async () => {
            try {
                const response = await fetchTopPromoters();
                setPromoters(response);
            } catch (err) {
                console.log(err);
            }
          };
      
          loadTopPromoters();
    }, []);

    return (
        <div>
            <ol className="author_list">
            { promoters && promoters.map((promoter, index) => (
                <li key={index}>
                    <UserTopSeller user={promoter} />
                </li>
            ))}
            </ol>
        </div>
    );
};
export default memo(AuthorList);