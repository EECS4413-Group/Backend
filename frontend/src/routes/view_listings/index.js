import { React, useEffect, useState } from "react";
import styled from "styled-components";
import api_wrapper from "../../api/api_wrapper";
import { useNavigate } from "react-router-dom";

const Results = styled.div`
  display: flex;
  flex-direction: column;
`;

const ViewListings = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.localStorage.getItem("authorization") == null) {
      navigate("/");
    }

    api_wrapper
      .get("/verify_login")
      .then((res) => {
        if (res.status != 200) {
          navigate("/");
        }
      })
      .catch(() => {
        window.localStorage.removeItem("authorization");
        navigate("/");
      });
  }, []);

  const [listings, setListings] = useState([]);
  useEffect(() => {
    api_wrapper.get(`/catalog/listing`).then((res) => {
      setListings(res.data.listings);
    });
  }, []);
  const query_new = () => {
    const query_word = document.getElementById("search-box").value;
    api_wrapper.get(`/catalog/listing?search=${query_word}`).then((res) => {
      setListings(res.data.listings);
    });
  };

  const RenderListings = () => {
    return listings.map((listing) => {
      return (
        <button
          key={listing.id}
          onClick={() => {
            navigate(`/listing/${listing.id}`);
          }}
        >
          {listing.name}
        </button>
      );
    });
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        id="search-box"
        onChange={query_new}
      />
      <button
        onClick={() => {
          navigate("/listings/new");
        }}
      >
        New Listing
      </button>
      <Results>{RenderListings()}</Results>
    </div>
  );
};

export default ViewListings;
