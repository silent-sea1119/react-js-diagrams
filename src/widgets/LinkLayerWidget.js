import * as React from "react";
import {LinkWidget} from "./LinkWidget";
import * as _ from "lodash";

export class LinkLayerWidget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	
	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		
		return (
			React.DOM.svg(
				{
          style:{
					transform: 'scale(' + diagramModel.getZoomLevel() / 100.0 + ') translate(' + diagramModel.getOffsetX() + 'px,' + diagramModel.getOffsetY()+'px)',
            width: '100%',
            height: '100%'
          }
        },
				_.map(diagramModel.getLinks(),(link) => {
					
					//TODO just improve this vastly x_x
					if (link.sourcePort !== null){
						try{
							//generate a point
							link.points[0].updateLocation(this.props.diagramEngine.getPortCenter(link.sourcePort));
						}
						//remove the link because its problematic (TODO implement this rather at an engine level)
						catch(ex){
							console.log(ex);
							diagramModel.removeLink(link);
							return;
						}
					}
					if (link.targetPort !== null){
						try{
							_.last(link.points).updateLocation(this.props.diagramEngine.getPortCenter(link.targetPort));
						}
						//remove the link because its problematic (TODO implement this rather at an engine level)
						catch(ex){
							console.log(ex);
							diagramModel.removeLink(link);
							return;
						}
					}
                    
					//generate links
					var generatedLink = this.props.diagramEngine.generateWidgetForLink(link);
                    if(!generatedLink){
						console.log("no link generated for type: " + link.getType());
						return null;
                    }
					
					return (
						React.createElement(LinkWidget, {
							key: link.getID(), 
							link: link,
							diagramEngine: this.props.diagramEngine,
						}, React.cloneElement(generatedLink,{pointAdded: this.props.pointAdded}))
					);
				})
			)
		);
	}
}
