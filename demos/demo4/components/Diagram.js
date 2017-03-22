import React from 'react';
import { DropTarget } from 'react-dnd';
import * as RJD from '../../../src/main';
import { OutputNodeModel } from './nodes/models/OutputNodeModel';
import { OutputWidgetFactory } from './nodes/OutputWidgetFactory';

// Setup the diagram engine
const diagramEngine = new RJD.DiagramEngine();
diagramEngine.registerNodeFactory(new RJD.DefaultNodeFactory());
diagramEngine.registerLinkFactory(new RJD.DefaultLinkFactory());
diagramEngine.registerNodeFactory(new OutputWidgetFactory());

// Setup the diagram model
const diagramModel = new RJD.DiagramModel();

const nodesTarget = {
  drop(props, monitor, component) {
    const { x: pageX, y: pageY } = monitor.getSourceClientOffset();
    const { left = 0, top = 0 } = diagramEngine.canvas.getBoundingClientRect();
    const x = pageX - left;
    const y = pageY - top;

    const outputNode = new OutputNodeModel();
    outputNode.x = x;
    outputNode.y = y;
    diagramModel.addNode(outputNode);
    diagramEngine.setDiagramModel(diagramModel);
  },
};

@DropTarget('node-source', nodesTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export class Diagram extends React.Component {
  render() {
    const { connectDropTarget } = this.props;

    // Render the canvas
    return connectDropTarget (
      <div className='diagram-drop-container'>
        <RJD.DiagramWidget diagramEngine={diagramEngine} />
      </div>
    );
  }
}
