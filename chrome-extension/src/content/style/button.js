const buttonStyle = `
  <style>
    .action-button {
      background-color: transparent;
      border: none;
      box-shadow: none;
      cursor: pointer;
      position: absolute;
      top: 2px;
      visibility: hidden;
    }
    .action-button:focus {
      outline: 0;
    }
    #back {
      right: 56px;
    }
    #close {
      right: 10px;
    }
    #drag {
      right: 33px;
    }
    #resize {
      bottom: -4px;
      cursor: ew-resize;
      left: -7px;
      right: auto;
      top: auto;
    }
  </style>
`;

export default buttonStyle;
