import { React, useState, useEffect } from "react";
import api_wrapper from "../../api/api_wrapper";
import styled from "styled-components";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const ViewListing = () => {
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

  const [listing, setListing] = useState({});
  const [currentBid, setCurrentBid] = useState(0);

  useEffect(() => {
    let id = window.location.href.split("/").at(-1);
    api_wrapper.get(`/catalog/listing/${id}`).then((res) => {
      setListing(res.data);
    });
  }, []);

  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    let id = window.location.href.split("/").at(-1);
    api_wrapper
      .get(`/marketplace/bid/${id}`)
      .then((res) => {
        if (res.status != 200) {
        } else {
          setCurrentBid(res.data.amount);
        }
      })
      .catch((err) => {});
    const interval = setInterval(() => setTime(Date.now()), 500);
    if (listing.type == "normal" && Date.now() > Date.parse(listing.end_date)) {
      clearInterval(interval);
    }
    if (listing.type == "dutch" && currentBid != 0) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const RenderCommon = () => {
    return (
      <>
        <h1>{listing.name}</h1>
        <h3>Type: {listing.type}</h3>
        <p>{listing.description}</p>
      </>
    );
  };

  const RenderNormal = () => {
    const handleSubmit = (event) => {
      //Prevent page reload
      event.preventDefault();

      var { bid } = document.forms[0];

      const data = {
        bid: {
          amount: bid.value,
          listing_id: listing.id,
        },
      };

      api_wrapper
        .post("/marketplace/bid", data)
        .then((res) => {
          if (res.status != 200) {
          } else {
            setCurrentBid(bid.value);
          }
        })
        .catch((err) => {});
    };
    if (Date.now() > Date.parse(listing.end_date)) {
      return (
        <>
          Auction Ended
          <br />
          <>Winning Bid: {currentBid}</>
        </>
      );
    }
    return (
      <Main>
        <>
          Current Bid Price: {currentBid}
          <br />
        </>
        <>
          Time Left:
          <Countdown date={Date.parse(listing.end_date)} />
          <form onSubmit={handleSubmit}>
            <input
              id="bid"
              name="bid"
              type="number"
              min={currentBid + 5}
              max={10000}
              step={50}
              defaultValue={currentBid + 5}
            />
            <button type="submit">Place bid</button>
          </form>
        </>
      </Main>
    );
  };

  const [price, setPrice] = useState(listing.price);
  let calculated_price = Math.max(
    0.5 * listing.price,
    listing.price -
      0.01 *
        listing.price *
        Math.floor((Date.now() - Date.parse(listing.start_date)) / (60 * 1000))
  );

  useEffect(() => {
    setPrice(calculated_price);
  }, [time]);

  const RenderDutch = () => {
    const HandleBuyNow = () => {
      const data = {
        bid: {
          amount: calculated_price,
          listing_id: listing.id,
        },
      };
      api_wrapper
        .post("/marketplace/bid", data)
        .then((res) => {
          if (res.status != 200) {
          } else {
            setCurrentBid(calculated_price);
          }
        })
        .catch((err) => {});
    };
    if (listing == {}) {
      return <></>;
    }

    const calculated_time =
      Date.now() +
      60000 -
      Math.floor(
        (((Date.now() - Date.parse(listing.start_date)) / 60000) % 1) * 60
      ) *
        1000;

    return (
      <Main>
        <>
          <>Current Price: {currentBid == 0 ? price : currentBid}</>
          <br />
        </>
        {currentBid == 0 ? (
          <>
            Time Left until next interval:
            <Countdown date={calculated_time} />
            <button type="submit" onClick={HandleBuyNow}>
              Buy Now
            </button>
          </>
        ) : (
          <>Auction Over</>
        )}
      </Main>
    );
  };

  if (listing == {}) {
    return <></>;
  }

  return (
    <Main>
      {RenderCommon()}
      {listing.type == "normal" && RenderNormal()}
      {listing.type == "dutch" && RenderDutch()}
    </Main>
  );
};

export default ViewListing;
