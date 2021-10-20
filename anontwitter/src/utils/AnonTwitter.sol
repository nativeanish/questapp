//SPDX-License-Identifier: MIT
pragma solidity = 0.8.9;

contract AnonTwitter{
    struct Tweet{
        string message;
        uint time;
    }
    Tweet [] anonTweet;
    constructor(){
        anonTweet.push(Tweet("Getting Started with learning ethereum and solidity from questbook app",block.timestamp));
    }

    function createTweet(string memory _msg) public returns(bool success){
        anonTweet.push(Tweet(_msg,block.timestamp));
        return true;
    }

    function getAllTweets() public view returns(Tweet [] memory){
        return anonTweet;
    }

    function getTweet(uint num) public view returns(Tweet memory){
        return anonTweet[num];
    }
}