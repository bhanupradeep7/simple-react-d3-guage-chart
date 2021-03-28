import React from 'react'

import {SimpleGuageChart} from 'simple-react-d3-guage-chart'
import 'simple-react-d3-guage-chart/dist/index.css'

const App = () => {
    return (
        <table>
            <thead>
            <th className={'title'} colSpan={2}>
                Simple React Guage Chart Examples
            </th>
            </thead>
            <tbody>

            <tr>
                <td>
                    <pre>
                        {`
                <SimpleGuageChart 
                    value={44}
                    id={"test-1"}
                />
                        `}
                    </pre>
                </td>
                <td>
                    <SimpleGuageChart value={44} id={"test-1"}/>
                </td>
            </tr>
            <tr>
                <td>
                    <pre>
                        {`
                <SimpleGuageChart 
                    value={80}
                    size={400}
                    id={"test-2"}
                    maxValue={220}
                    majorTicks={8}
                    pointerWidth={9}
                    ticksRingWidth={25}
                    pointerLength={0.8}
                    mainRingWidth={25}
                    arcColor={"#63636f"}
                    pointerColor={"#c70000"}
                    tickColors={["#ffff00", "#f00"]}            
                />
                        `}
                    </pre>
                </td>
                <td>
                    <SimpleGuageChart value={80}
                                      size={400}
                                      id={"test-2"}
                                      maxValue={220}
                                      majorTicks={8}
                                      pointerWidth={9}
                                      ticksRingWidth={25}
                                      pointerLength={0.8}
                                      mainRingWidth={25}
                                      arcColor={"#63636f"}
                                      pointerColor={"#c70000"}
                                      tickColors={["#ffff00", "#f00"]}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    <pre>
                        {`
                <SimpleGuageChart 
                    value={44}
                    id={"test-3"}
                    minAngle={-90}
                    maxAngle={90}
                />
                        `}
                    </pre>
                </td>
                <td>
                    <SimpleGuageChart value={44}
                                      id={"test-3"}
                                      minAngle={-90}
                                      maxAngle={90}
                    />
                </td>
            </tr>

            <tr>
                <td>
                    <pre>
                        {`
                <SimpleGuageChart 
                    value={4.4}
                    size={250}
                    id={"test-4"}
                    maxValue={10}
                    majorTicks={8}
                    ticksRingWidth={10}
                    pointerLength={0.6}
                    mainRingWidth={5}
                    arcColor={"#fff"}
                    pointerColor={"#666"}
                    tickColors={["#fff", "#fff"]}
                    fontColor={"#fff"}
                    tickFontColor={"#fff"}
                />
                        `}
                    </pre>
                </td>
                <td style={{backgroundColor: "#000"}}>
                    <SimpleGuageChart value={4.4}
                                      size={250}
                                      id={"test-4"}
                                      maxValue={10}
                                      majorTicks={8}
                                      ticksRingWidth={10}
                                      pointerLength={0.6}
                                      mainRingWidth={5}
                                      arcColor={"#fff"}
                                      pointerColor={"#666"}
                                      tickColors={["#fff", "#fff"]}
                                      fontColor={"#fff"}
                                      tickFontColor={"#fff"}
                    />
                </td>
            </tr>
            </tbody>
        </table>)
}

export default App
