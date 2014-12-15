

module.exports = [
	{
	  type: "input",
	  name: "projectDescription",
	  message: "What is your quest? (Project description)",
	  default: "A Jam3 project"
	},
	{
	  type: "input",
	  name: "projectRepository",
	  message: "What is your git repository? (GitHub Repository)",
	  default: ""
	},
	{
	  type: "input",
	  name: "projectAuthor",
	  message: "What is your name? (Author)",
	  default: "Jam3"
	},
	{
	  type: "input",
	  name: "projectAuthorEmail",
	  message: "What is your email? (Author Email)",
	  default: "info@jam3.com"
	},
	{
	  type: "confirm",
	  name: "useBower",
	  message: "Would you like to use Bower? (Use Bower?)",
	  default: false
	},
	{
	  type: "confirm",
	  name: "useTexturePackager",
	  message: "Would you like to use TextutePackager",
	  default: false
	},
	{
	  type: "checkbox",
	  message: "Select the project is based on?",
	  name: "baseSelector",
	  choices: [
	    {
	      name: "DOM",
	      value: "dom",
	      checked: true
	    },
	    {
	      name: "CANVAS",
	      value: "canvas"
	    }
	  ],
	  validate: function( answer ) {
	    // if ( answer.length < 1 ) {
	    //   return "You must choose at least one topping.";
	    // }
	    return true;
	  }
	},
	//Choose template system ('hbs', 'ear', 'vue', 'none')
	{
		type: "list",
		name: "templateLibrary",
		message: "Choose template system",
		choices: [ "hbs", "ear", "vue", "none"],
		filter: function( val ) { return val.toLowerCase(); }
	},

	{
	  type: "checkbox",
	  message: "Select additional libraries to include",
	  name: "extraLibraries",
	  choices: [
	    {
	      name: "Three.js",
	      value: "threejs"
	    },
	    {
	      name: "PIXI",
	      value: "pixi"
	    },
	    {
	      name: "GSAP",
	      value: "gsap",
	      checked: true
	    }
	  ],
	  validate: function( answer ) {
	    // if ( answer.length < 1 ) {
	    //   return "You must choose at least one topping.";
	    // }
	    return true;
	  }
	}
];