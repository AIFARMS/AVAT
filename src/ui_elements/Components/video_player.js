import React from 'react';
import ReactPlayer from 'react-player'
import FabricRender from "../Components/fabric_canvas";


export default function VideoPlayer() {
	
	return (
		<div>
			<div style={{gridColumn: 1, gridRow:1, position: "relative", width: scaling_factor_width, height: scaling_factor_height, top: 0, left: 0, opacity: player_opacity}}>
			{
				inputType==0 && 
				<ReactPlayer 
					onReady={handleOnReady}
					ref={handleSetPlayer} 
					onDuration={handleSetDuration} 
					url={videoFilePath} 
					width='100%'
					height='100%'
					playing={playing} 
					controls={false} 
					style={{position:'absolute', float:'left', top:0, left:0}}
					volume={0}
					muted={true}
					pip={false}
					playbackRate={playbackRate}
					id="myvideo"
				/>
			}
			</div>
			<div style={{gridColumn: 1, gridRow:1, position: "relative",  top: 0, left: 0, opacity: 100-player_opacity}}>
				<FabricRender 
					fabricCanvas={fabricCanvas}
					currentFrame={currentFrame}
					save_data={save_data}
					scaling_factor_height={scaling_factor_height}
					scaling_factor_width={scaling_factor_width}
				/>
			</div>
		</div>
	)

}