import MediaInfo from 'mediainfo.js'
import React, { useCallback, useState } from 'react'

const readChunk = (file) => (chunkSize, offset) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target.error) {
        reject(event.target.error)
      }
      resolve(new Uint8Array(event.target.result))
    }
    reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
  })

export default function fileMetadata (file){
    return;
    if (file) {
        console.log(file)
        var output = 'Working…'
    
        const getSize = () => file.size
    
        MediaInfo().then((mediainfo) => mediainfo
            .analyzeData(() => file.size, readChunk(file))
            .then((result) => {
                output = result
                console.log(result)
            })
            .catch((error) => {
                output = `An error occured:\n${error.stack}`
            }))
        return output
    }
}
  
