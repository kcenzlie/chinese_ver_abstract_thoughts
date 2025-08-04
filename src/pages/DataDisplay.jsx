import { useEffect, useState } from 'react'

function DataDisplay() {
    const [data, setData] = useState([])
    useEffect(() => {
      fetch('http://localhost:8081/hello')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.log(err))
    }, [])
    return (
      <div>
        <table>
          <thead>
            <th>text_column</th>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td>{d.text_column}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
}

export default DataDisplay;