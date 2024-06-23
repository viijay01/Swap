import unicornImage from "./uni.png";
import drop from "./drop.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

function App() {
  const [isRotated1, setIsRotated1] = useState(false);
  const [isRotated2, setIsRotated2] = useState(false);
  const imageRef1 = useRef(null);
  const imageRef2 = useRef(null);
  const [selectedItem, setSelectedItem] = useState("Select token");
  const [selectedItem2, setSelectedItem2] = useState("Select token");
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);

  const handleImageClick1 = () => {
    setIsRotated1(!isRotated1);
    setIsRotated2(false);
  };

  const handleImageClick2 = () => {
    setIsRotated2(!isRotated2);
    setIsRotated1(false);
  };

  const handleSelect = (eventKey, event) => {
    setSelectedItem(event.target.textContent);
    convertAmount(amount, event.target.textContent, selectedItem2);
  };

  const handleSelect2 = (eventKey, event) => {
    setSelectedItem2(event.target.textContent);
    convertAmount(amount, selectedItem, event.target.textContent);
  };

  const handleAmountChange = (event) => {
    const inputAmount = parseFloat(event.target.value);
    setAmount(inputAmount);
    convertAmount(inputAmount, selectedItem, selectedItem2);
  };

  const handleSwapCurrencies = () => {
    const temp = selectedItem;
    setSelectedItem(selectedItem2);
    setSelectedItem2(temp);
    convertAmount(amount, selectedItem2, selectedItem);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.frankfurter.app/currencies');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const symbols = Object.keys(data);
        setCurrencies(symbols);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const convertAmount = async (amount, fromCurrency, toCurrency) => {
    try {
      const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setConvertedAmount(data.rates[toCurrency]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <header>
        <div className="header">
          <div className="App">
            <div className="uniimage">
              <img src={unicornImage} alt="Unicorn" className={`small-image`} />
            </div>

            <p>Swap</p>
            <p>Explore</p>
            <p>NFTs</p>
            <p>Pool</p>
            {/* <div ref={imageRef1} className="uniimage" onClick={handleImageClick1}>
              <img src={drop} alt="Drop" className={`small-image ${isRotated1 ? 'rotate180' : ''}`} />
            </div> */}
          </div>
          <div className="input-icons">
            <FontAwesomeIcon icon={faSearch} className="icon" />
            <input className="input-field" type="text" placeholder="Search" />
          </div>
          <div className="cntbtn">
            {/* <div ref={imageRef2} className="uniimage" onClick={handleImageClick2}>
              <img src={drop} alt="Drop" className={`small-image ${isRotated2 ? 'rotate180' : ''}`} />
            </div> */}
            <button>Connect</button>
          </div>
        </div>
      </header>
      <main className="main">
        <div className="list">
          <p>Swap</p>
          <p>Limit</p>
          <p>Send</p>
          <p>Buy</p> <span className="gearicon">
            <FontAwesomeIcon icon={faGear} className="icon2" />
          </span>
        </div>
        <div className="currencycon">
          <div className="bigbox">
            <div className="box">
              <span>Sell</span><input name="myInput" value={amount} onChange={handleAmountChange} placeholder="0" className="input" />
              <span>{selectedItem}</span>
            </div>
            <div>
              <Dropdown onSelect={handleSelect} >
                <Dropdown.Toggle id="dropdown-basic">
                  {selectedItem}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {currencies.map((currency, index) => (
                    <Dropdown.Item key={index} eventKey={currency}>{currency}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="down" onClick={handleSwapCurrencies}><FontAwesomeIcon icon={faChevronDown} /></div>
        <div className="currencycon">
          <div className="bigbox">
            <div className="box">
              <span>Buy</span><input name="myInput" value={convertedAmount} readOnly placeholder="0" className="input" />
              <span>{selectedItem2}</span>
            </div>
            <div>
              <Dropdown onSelect={handleSelect2} >
                <Dropdown.Toggle id="dropdown-basic">
                  {selectedItem2}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {currencies.map((currency, index) => (
                    <Dropdown.Item key={index} eventKey={currency}>{currency}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="cntbtn2"><button>Connect Wallet</button></div>
      </main>
    </div>
  );
}

export default App;
