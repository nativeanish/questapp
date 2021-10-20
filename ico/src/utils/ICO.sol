//SPDX-License-Identifier: MIT
pragma solidity = 0.8.9;

contract ICO{
  uint tokenPrice = 0.001 ether;
  uint public capital = 300 ether;
  uint public salesStart = block.timestamp;
  uint public endStart;
  uint public mininvestment = 0.010 ether;
  uint public raisedAmt;
  address payable public depositer;
  string private _name;
    string private _symbols;
    uint private _totalSupply;
    uint8 private _decimals;
    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _from, address indexed _to, uint _value);
    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowances;
    constructor(string memory __name, string memory symbols, address payable _deposit, uint timend){
        depositer = _deposit;
        _decimals = 5;
        _totalSupply = 100000000000;
        _name = __name;
        _symbols = symbols;
        balances[_deposit] = _totalSupply;
        endStart = block.timestamp + timend;
    }
  function name() public view  returns(string memory){
        return _name;
    }
    function symbol() public view  returns(string memory){
        return _symbols;
    }
    function totalSupply() public view   returns(uint){
        return _totalSupply;
    }
    function decimals() public view   returns(uint8){
        return _decimals;
    }
    function balanceOf(address _owner) public   view returns (uint){
        return balances[_owner];
    }

    function transfer(address _to, uint _value) public   returns (bool){
        require(balances[msg.sender] >= _value, "Don't have that much of token to transfer");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    function approve(address _spender, uint _value) public   returns (bool){
        require(balances[msg.sender] >= _value,"Cannot set a limit bcoz you don't have that much balance");
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    function allowance(address _owner, address _spender) public   view returns (uint){
        return allowances[_owner][_spender];
    }
    function transferFrom(address _from, address _to, uint _value) public   returns (bool success){
        require(allowances[_from][_to] >= _value);
        require(balances[_from] >= _value);
        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][_to] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
    function increaseAllowances(address _spender, uint _value) public   returns(bool){
        require(balances[msg.sender] >= allowances[msg.sender][_spender]+_value, "Don't have enough balance to increase");
        allowances[msg.sender][_spender] += _value;
        emit Approval(msg.sender, _spender, allowances[msg.sender][_spender]+_value);
        return true;
    }
    function decreaseAllowances(address _spender, uint _value) public   returns(bool){
        allowances[msg.sender][_spender] -= _value;
        emit Approval(msg.sender, _spender, allowances[msg.sender][_spender]-_value);
        return true;
    }
    function burn(address _to, uint _value) public   returns (bool success){
        require(_to != address(0),"You cannot burn the token from contract itself");
        require(balances[_to] <= _value, "You don't have that much of token to burn");
        balances[_to] -= _value;
        _totalSupply -= _value;
        emit Transfer(_to, address(0),_value);
        return true;
    }
    function mint(address _to, uint _value) public   returns (bool success){
        require(_to != address(0),"You cannot mine the token from contract itself");
        _totalSupply += _value;
        balances[_to] += _value;
        emit Transfer(address(0),_to,_value);
        return true;
    }
  

  receive () external payable{
      invest();
  }

  function invest() payable public returns(bool){
      require(msg.value+raisedAmt <= capital,"We don;t accept more tokens");
      require(block.timestamp < salesStart,"Sale is Going to Start Soon !");
      require(block.timestamp > endStart, "Sale is Ended");
      require(msg.value >= mininvestment, "Dont' Match the Investment capital");
      uint tokens = msg.value/tokenPrice;
      balances[msg.sender] += tokens;
      balances[depositer] -= tokens;
      raisedAmt += msg.value;
      emit Transfer(address(0),msg.sender,tokens);
      depositer.transfer(msg.value);
      return true;
  }
  
}