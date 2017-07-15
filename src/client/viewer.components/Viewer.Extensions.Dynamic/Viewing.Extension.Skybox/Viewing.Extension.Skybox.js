/////////////////////////////////////////////////////////////////////
// Viewing.Extension.Skybox
// by Philippe Leefsma, July 2017
//
/////////////////////////////////////////////////////////////////////
import MultiModelExtensionBase from 'Viewer.MultiModelExtensionBase'
import xpos from './img/bridge/skybox-xpos.png'
import xneg from './img/bridge/skybox-xneg.png'
import ypos from './img/bridge/skybox-ypos.png'
import yneg from './img/bridge/skybox-yneg.png'
import zpos from './img/bridge/skybox-zpos.png'
import zneg from './img/bridge/skybox-zneg.png'
import EventTool from 'Viewer.EventTool'
import Skybox from 'Viewer.Skybox'
import Stopwatch from 'Stopwatch'

class SkyboxExtension extends MultiModelExtensionBase {

  /////////////////////////////////////////////////////////
  // Class constructor
  //
  /////////////////////////////////////////////////////////
  constructor(viewer, options) {

    super (viewer, options)

    this.onUserInteraction =
      this.onUserInteraction.bind(this)

    this.runAnimation =
      this.runAnimation.bind(this)

    this.eventTool = new EventTool(viewer)

    this.eventTool.on('mousewheel', (e) => {

      return true
    })

    this.eventTool.on('buttondown', (e) => {

      window.clearTimeout(this.timeoutId)

      this.userInteraction = true

      return false
    })

    this.eventTool.on('buttonup', (e) => {

      this.timeoutId = window.setTimeout(() => {
        this.stopwatch.getElapsedMs()
        this.runAnimation()
      }, 3500)

      this.userInteraction = false

      return false
    })

    const imageList = [
      xpos, xneg,
      ypos, yneg,
      zpos, zneg
    ]

    const size = new THREE.Vector3()

    size.fromArray(options.size || [10000, 10000, 10000])

    this.skybox = new Skybox(viewer, {
      imageList,
      size
    })

    this.stopwatch = new Stopwatch()
  }

  /////////////////////////////////////////////////////////
  // Extension Id
  //
  /////////////////////////////////////////////////////////
  static get ExtensionId() {

    return 'Viewing.Extension.Skybox'
  }

  /////////////////////////////////////////////////////////
  // Load callback
  //
  /////////////////////////////////////////////////////////
  load() {

    console.log('Viewing.Extension.Skybox loaded')

    return true
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onModelCompletedLoad (event) {

    if (event.model.dbModelId) {

      this.viewer.navigation.toPerspective()

      this.loadContainer(this.options.containerURN).then(
        () => {
          this.options.loader.show(false)
        })

      const pos = this.viewer.navigation.getPosition()

      this.viewer.navigation.setPosition(
        new THREE.Vector3(pos.x, pos.y - 100, pos.z))

      this.stopwatch.getElapsedMs()

      this.eventTool.activate()

      this.runAnimation()
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  loadContainer (urn) {

    return new Promise(async(resolve) => {

      const doc = await this.options.loadDocument(urn)

      const path = this.options.getViewablePath(doc)

      this.viewer.loadModel(path, {}, (model) => {

        resolve (model)
      })
    })
  }

  /////////////////////////////////////////////////////////
  // Unload callback
  //
  /////////////////////////////////////////////////////////
  unload() {

    console.log('Viewing.Extension.Skybox unloaded')

    window.cancelAnimationFrame(this.animId)

    this.userInteraction = true

    this.eventTool.off()
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  onUserInteraction () {

    console.log('onUserInteraction')
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  rotateCamera (axis, speed, dt) {

    const pos = this.viewer.navigation.getPosition()

    const matrix = new THREE.Matrix4().makeRotationAxis(
      axis, speed * dt);

    pos.applyMatrix4(matrix)

    this.viewer.navigation.setPosition(pos)
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  runAnimation () {

    if (!this.userInteraction) {

      const dt = this.stopwatch.getElapsedMs() * 0.001

      const axis = new THREE.Vector3(0,1,0)

      this.rotateCamera(axis, 10.0 * Math.PI/180, dt)

      this.animId = window.requestAnimationFrame(
        this.runAnimation)
    }
  }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  SkyboxExtension.ExtensionId,
  SkyboxExtension)